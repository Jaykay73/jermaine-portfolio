/**
 * Vite Dev Plugin — handles /api/chat requests during local development.
 * In production (Vercel), the /api/chat.js serverless function handles this.
 * This plugin reads NVIDIA_API_KEY from .env and proxies to NVIDIA's API.
 */

import { readFileSync } from "fs";
import { resolve } from "path";

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
  // Read .env file at plugin init to get NVIDIA_API_KEY
  let nvidiaApiKey = process.env.NVIDIA_API_KEY || "";
  try {
    const envPath = resolve(process.cwd(), ".env");
    const envContent = readFileSync(envPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed.startsWith("NVIDIA_API_KEY=")) {
        nvidiaApiKey = trimmed.slice("NVIDIA_API_KEY=".length).trim();
        break;
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

        const { message } = parsed;
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

        // Use API key read from .env at plugin init
        const apiKey = nvidiaApiKey;
        if (!apiKey) {
          console.error("[chat-api-dev] NVIDIA_API_KEY not found in environment");
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Chat service not configured. Add NVIDIA_API_KEY to .env" }));
          return;
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
                  content: `${SYSTEM_PROMPT}\n\nUser question: ${trimmed}`,
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
          res.end(JSON.stringify({ reply }));
        } catch (err) {
          console.error("[chat-api-dev] Error:", err.message);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Something went wrong. Please try again." }));
        }
      });
    },
  };
}
