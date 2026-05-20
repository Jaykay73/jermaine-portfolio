/**
 * Vite Dev Plugin — handles /api/chat requests during local development.
 * In production (Vercel), the /api/chat.js serverless function handles this.
 * This plugin reads NVIDIA_API_KEY, PINECONE_API_KEY, and PINECONE_INDEX_NAME from .env and proxies to Pinecone + NVIDIA's APIs.
 */

import { readFileSync } from "fs";
import { resolve } from "path";
import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "google/gemma-2-2b-it";
const MAX_TOKENS = 400;
const TEMPERATURE = 0.4;
const MAX_MESSAGE_LENGTH = 1000;

const SYSTEM_PROMPT = `You are John Aledare's portfolio assistant. John, also known as Jermaine, is an AI Engineer and Machine Learning Engineer who builds production-ready AI systems.

Key facts about John:
- Builds end-to-end ML/AI systems from research to deployment
- Strong skills: Python, PyTorch, TensorFlow, FastAPI, NLP, Computer Vision, RAG pipelines, Vector Search
- Notable projects: Nigerian Pidgin Next-Word Predictor (LSTM + Trigram), AI Resume Optimizer (Gemini 2.0), CineMatch recommendation engine (FAISS + embeddings), Legal Document Analyzer (RAG), Brain Tumor MRI Classifier (EfficientNet), Credit scoring models
- Deployment experience: Docker, Hugging Face Spaces, Vercel, Streamlit Cloud
- Frameworks: Next.js, React, Streamlit for frontends; FastAPI for backends
- Interests: NLP for low-resource African languages, production ML systems, AI-powered developer tools

Answer questions about John's skills, projects, experience, and engineering approach. Be concise, friendly, technically accurate, and honest. If asked something you do not know, say you do not know. Do not invent personal details.`;

export function chatApiPlugin() {
  // Read .env file at plugin init to get API keys
  let nvidiaApiKey = process.env.NVIDIA_API_KEY || "";
  let pineconeApiKey = process.env.PINECONE_API_KEY || "";
  let pineconeIndexName = process.env.PINECONE_INDEX_NAME || "";

  try {
    const envPath = resolve(process.cwd(), ".env");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("NVIDIA_API_KEY=")) {
        nvidiaApiKey = trimmed.slice("NVIDIA_API_KEY=".length).trim();
      } else if (trimmed.startsWith("PINECONE_API_KEY=")) {
        pineconeApiKey = trimmed.slice("PINECONE_API_KEY=".length).trim();
      } else if (trimmed.startsWith("PINECONE_INDEX_NAME=")) {
        pineconeIndexName = trimmed.slice("PINECONE_INDEX_NAME=".length).trim();
      }
    }
  } catch {
    // .env file may not exist
  }

  return {
    name: "chat-api-dev",
    configureServer(server) {
      server.middlewares.use("/api/chat", async (req, res) => {
        // Only handle POST
        if (req.method !== "POST") {
          res.writeHead(405, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        // Read body
        let body = "";
        for await (const chunk of req) {
          body += chunk;
        }

        let parsed;
        try {
          parsed = JSON.parse(body);
        } catch {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Invalid JSON" }));
          return;
        }

        const { message, mode } = parsed;
        if (!message || typeof message !== "string" || !message.trim()) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "A message is required." }));
          return;
        }

        const trimmed = message.trim();
        if (trimmed.length > MAX_MESSAGE_LENGTH) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: `Message too long. Max ${MAX_MESSAGE_LENGTH} characters.` }));
          return;
        }

        const apiKey = nvidiaApiKey;
        if (!apiKey) {
          console.error("[chat-api-dev] NVIDIA_API_KEY not found in environment");
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Chat service not configured. Add NVIDIA_API_KEY to .env" }));
          return;
        }

        let retrievedContext = "";
        let sources = [];

        // Query Pinecone for context similarity if configured
        if (pineconeApiKey && pineconeIndexName) {
          try {
            const pinecone = new Pinecone({ apiKey: pineconeApiKey });
            const index = pinecone.index(pineconeIndexName);
            const openai = new OpenAI({
              apiKey: apiKey,
              baseURL: "https://integrate.api.nvidia.com/v1",
            });

            // Generate embedding for user query
            const embedResponse = await openai.embeddings.create({
              model: "nvidia/nv-embed-v1",
              input: `Represent this query for retrieving relevant passages: ${trimmed}`,
              encoding_format: "float",
            });
            const embedding = embedResponse.data[0].embedding;

            // Query namespace "portfolio"
            const queryResponse = await index.namespace("portfolio").query({
              vector: embedding,
              topK: 4,
              includeMetadata: true,
            });

            if (queryResponse && queryResponse.matches && queryResponse.matches.length > 0) {
              const matches = queryResponse.matches
                .filter(match => match.score > 0.3 && match.metadata && match.metadata.text);

              const formattedMatches = matches.map(match => {
                const meta = match.metadata;
                let text = `[Source: ${meta.title || "General"}] ${meta.text.trim()}`;
                
                // Formulate and inject explicit links into the RAG text context
                if (meta.liveUrl && meta.liveUrl !== "#") {
                  text += `\nLive Demo Link: ${meta.liveUrl}`;
                }
                if (meta.githubUrl) {
                  text += `\nGitHub Code Link: ${meta.githubUrl}`;
                }
                if (meta.url && meta.url !== "#") {
                  text += `\nExternal URL Link: ${meta.url}`;
                }

                // Compile sources for citation UI rendering
                const sourceUrl = (meta.liveUrl && meta.liveUrl !== "#") ? meta.liveUrl : (meta.githubUrl || meta.url);
                if (sourceUrl && sourceUrl !== "#") {
                  if (!sources.some(s => s.url === sourceUrl)) {
                    sources.push({
                      title: meta.title || "Reference",
                      type: meta.type || "reference",
                      url: sourceUrl
                    });
                  }
                }
                
                return text;
              });

              if (formattedMatches.length > 0) {
                retrievedContext = formattedMatches.join("\n\n");
                console.log(`[chat-api-dev RAG] Retrieved ${formattedMatches.length} context items from Pinecone.`);
              }
            }
          } catch (ragErr) {
            console.error("[chat-api-dev RAG Error] Could not retrieve context from Pinecone:", ragErr.message);
            // Gracefully proceed without RAG context
          }
        } else {
          console.warn("[chat-api-dev RAG Warning] Pinecone not configured. RAG is disabled.");
        }

        // Construct Dynamic RAG Prompt
        let finalSystemPrompt = SYSTEM_PROMPT;
        if (retrievedContext) {
          finalSystemPrompt = `You are John Aledare's portfolio assistant. John, also known as Jermaine, is an AI Engineer and Machine Learning Engineer who builds production-ready AI systems.

Use the following retrieved context chunks from John's portfolio database to answer the user's question. Be concise, friendly, technically accurate, and honest.

--- RETRIEVED CONTEXT ---
${retrievedContext}
-------------------------

--- HYPERLINK RESOLUTION RULE ---
Whenever you discuss, mention, or recommend any project that has a Live Demo Link or GitHub Code Link in the retrieved context, you MUST include a clickable Markdown hyperlink directly in your response (e.g. \`[Live Demo](URL)\` or \`[GitHub Repo](URL)\`). Do not just write the URL out, always format it as a markdown hyperlink. If a project has both links, provide both.

Answer questions about John's skills, projects, experience, and engineering approach. Be concise, friendly, technically accurate, and honest. If asked something you do not know, say you do not know. Do not invent personal details.`;
        }

        // Apply specialized Hire Mode directive
        if (mode === "hire") {
          finalSystemPrompt += `\n\n--- 💼 RECRUITER MODE DIRECTIVE (CRITICAL) ---
The user is a recruiter, hiring manager, or potential client. 
- You MUST prioritize showcasing John's technical strengths, production coding standard, and readiness to join remote, hybrid, or on-site engineering teams.
- Proactively provide his contact details (email: aledareoluwaseunjohn@gmail.com, GitHub: https://github.com/Jaykay73, LinkedIn: https://www.linkedin.com/in/johnaledare).
- Warmly encourage them to schedule a meeting or reach out directly to hire him. Be highly professional and engaging.`;
        }

        try {
          const nvidiaRes = await fetch(NVIDIA_BASE_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: MODEL,
              messages: [
                {
                  role: "user",
                  content: `${finalSystemPrompt}\n\nUser question: ${trimmed}`,
                },
              ],
              max_tokens: MAX_TOKENS,
              temperature: TEMPERATURE,
              top_p: 0.7,
              stream: false,
            }),
          });

          if (!nvidiaRes.ok) {
            const errText = await nvidiaRes.text().catch(() => "");
            console.error(`[chat-api-dev] NVIDIA API error: ${nvidiaRes.status} — ${errText}`);
            res.writeHead(502, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "AI service temporarily unavailable." }));
            return;
          }

          const data = await nvidiaRes.json();
          const reply = data?.choices?.[0]?.message?.content?.trim() ||
            "I couldn't generate a response right now.";

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ reply, sources }));
        } catch (err) {
          console.error("[chat-api-dev] Error:", err.message);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Something went wrong. Please try again." }));
        }
      });
    },
  };
}
