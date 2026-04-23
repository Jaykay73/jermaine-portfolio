// Vercel Serverless Function — POST /api/chat
// Proxies chat messages to NVIDIA's OpenAI-compatible API
// NVIDIA_API_KEY must be set in Vercel Environment Variables

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
  const { message } = req.body || {};

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
            content: `${SYSTEM_PROMPT}\n\nUser question: ${trimmedMessage}`,
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

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
}
