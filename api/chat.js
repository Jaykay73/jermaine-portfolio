// Vercel Serverless Function — POST /api/chat
// Proxies chat messages to NVIDIA's completions API using Pinecone RAG retrieval
// NVIDIA_API_KEY, PINECONE_API_KEY, and PINECONE_INDEX_NAME must be set in Environment Variables

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
- Notable projects: Nigerian Pidgin Next-Word Predictor (LSTM + Trigram), AI Resume Optimizer (Gemini 2.0), CineMatch recommendation engine (FAISS + embeddings), Legal Document Analyzer (RAG), Brain Tumor MRI Classifier (EfficientNet), BitCheck (multi-signal image verification API), Diabetic Retinopathy Classifier (Streamlit + Grad-CAM), LockedIn AI Service (FastAPI learning roadmaps), Flappy Bird RL (reinforcement learning control algorithms), Credit scoring models
- Deployment experience: Docker, Hugging Face Spaces, Vercel, Streamlit Cloud
- Frameworks: Next.js, React, Streamlit for frontends; FastAPI for backends
- Interests: NLP for low-resource African languages, production ML systems, AI-powered developer tools

Answer questions about John's skills, projects, experience, and engineering approach. Be concise, friendly, technically accurate, and honest. If asked something you do not know, say you do not know. Do not invent personal details.`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Validate API key exists
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.error("NVIDIA_API_KEY is not configured");
    return res.status(500).json({ error: "Chat service is not configured. Please try again later." });
  }

  // Validate request body
  const { message, mode } = req.body || {};

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "A message is required." });
  }

  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({
      error: `Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters.`,
    });
  }

  const pineconeApiKey = process.env.PINECONE_API_KEY;
  const pineconeIndexName = process.env.PINECONE_INDEX_NAME;

  let retrievedContext = "";
  let sources = [];

  // Perform RAG if Pinecone is configured
  if (pineconeApiKey && pineconeIndexName) {
    try {
      // 1. Initialize Clients
      const pinecone = new Pinecone({ apiKey: pineconeApiKey });
      const index = pinecone.index(pineconeIndexName);
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://integrate.api.nvidia.com/v1",
      });

      // 2. Generate Query Embedding
      const embedResponse = await openai.embeddings.create({
        model: "nvidia/nv-embed-v1",
        input: `Represent this query for retrieving relevant passages: ${trimmedMessage}`,
        encoding_format: "float",
      });
      const embedding = embedResponse.data[0].embedding;

      // 3. Query Pinecone namespace "portfolio"
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
          console.log(`[RAG] Successfully retrieved ${formattedMatches.length} context chunks from Pinecone.`);
        }
      }
    } catch (err) {
      console.error("[RAG Error] Failed to retrieve context from Pinecone:", err.message);
      // Fallback gracefully to non-RAG chat behavior
    }
  } else {
    console.warn("[RAG Warn] Pinecone is not configured. Falling back to default system prompt.");
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
    const response = await fetch(NVIDIA_BASE_URL, {
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
            content: `${finalSystemPrompt}\n\nUser question: ${trimmedMessage}`,
          },
        ],
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        top_p: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`NVIDIA API error: ${response.status} — ${errorText}`);
      return res.status(502).json({
        error: "The AI service is temporarily unavailable. Please try again later.",
      });
    }

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "I'm sorry, I couldn't generate a response right now.";

    return res.status(200).json({ reply, sources });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
}
