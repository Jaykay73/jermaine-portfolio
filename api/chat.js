// Vercel Serverless Function — POST /api/chat
// Proxies chat messages to NVIDIA's completions API using Pinecone RAG retrieval
// and LangChain for conversation memory management.
// NVIDIA_API_KEY, PINECONE_API_KEY, and PINECONE_INDEX_NAME must be set in Environment Variables

import { Pinecone } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import { generateChatReply } from "../lib/chatEngine.js";
import { portfolioKB } from "../data/portfolio-kb.js";

const MAX_MESSAGE_LENGTH = 1000;

function getLocalContext(query) {
  const stopwords = new Set(["what", "is", "the", "and", "for", "with", "about", "tell", "can", "you", "does", "have", "any", "how", "who", "are", "his", "her", "their", "this", "that", "projects", "project", "work", "built"]);
  const cleaned = (query || "").toLowerCase().replace(/[^\w\s]/g, " ");
  const allTokens = cleaned.split(/\s+/).filter((t) => t.length > 1);
  const keywords = allTokens.filter((t) => !stopwords.has(t) && t.length > 2);
  const tokensToUse = keywords.length > 0 ? keywords : allTokens;

  const scored = portfolioKB.map((item) => {
    let score = 0;
    const titleLower = (item.title || "").toLowerCase();
    const tagsLower = (item.metadata?.tags || []).join(" ").toLowerCase();
    const textLower = (item.text || "").toLowerCase();

    for (const t of tokensToUse) {
      if (titleLower.includes(t)) score += 6;
      if (tagsLower.includes(t)) score += 3;
      if (textLower.includes(t)) score += 1;
    }
    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matched = scored.filter((s) => s.score > 0).slice(0, 4);
  const selected = matched.length > 0 ? matched.map((s) => s.item) : portfolioKB.slice(0, 4);

  const sources = [];
  const textChunks = selected.map((item) => {
    let text = `[Source: ${item.title || "General"}] ${item.text.trim()}`;
    const live = item.metadata?.liveUrl;
    const github = item.metadata?.githubUrl;
    const url = item.metadata?.url;

    if (live && live !== "#") text += `\nLive Demo Link: ${live}`;
    if (github && github !== "#") text += `\nGitHub Code Link: ${github}`;
    if (url && url !== "#") text += `\nExternal URL Link: ${url}`;

    const sourceUrl = (live && live !== "#") ? live : (github && github !== "#" ? github : url);
    if (sourceUrl && sourceUrl !== "#" && !sources.some((s) => s.url === sourceUrl)) {
      sources.push({
        title: item.title || "Reference",
        type: item.type || "reference",
        url: sourceUrl,
      });
    }
    return text;
  });

  return { context: textChunks.join("\n\n"), sources };
}

const SYSTEM_PROMPT = `You are John Aledare's portfolio assistant. John, also known as Jermaine, is an AI Engineer and Machine Learning Engineer who builds production-ready AI systems.

Key facts about John:
- Builds end-to-end ML/AI systems from research to deployment
- Strong skills: Python, PyTorch, TensorFlow, FastAPI, NLP, Computer Vision, RAG pipelines, Vector Search
- Notable projects:
  - BitCheck (multimodal media integrity verification API for text, images, video, and audio using PyTorch EfficientNet, Grad-CAM, C2PA, and FastAPI)
  - Diabetic Retinopathy Classifier (medical computer vision with Grad-CAM explainability, deployed on Streamlit Cloud)
  - LockedIn AI Service (FastAPI service generating custom beginner-friendly learning roadmaps using DeepSeek LLM, Tavily API, and SQLite)
  - Flappy Bird RL (reinforcement learning with Q-learning, PPO, NEAT-Python, and Gymnasium)
  - Nigerian Pidgin Next-Word Predictor (dual-model LSTM + Trigram with debounced real-time frontend)
  - AI Resume Optimizer (Gemini 2.0 Flash with ONNX quantization for skill gap analysis)
  - CineMatch API (vector similarity recommendations with FAISS and MiniLM)
  - Legal Document Analyzer (RAG contract analysis)
  - Brain Tumor MRI Classifier (EfficientNetB0 with quantization for edge mobile inference)
- Deployment experience: Docker, Hugging Face Spaces, Vercel, Streamlit Cloud
- Education: Studying B.Eng. in Computer Engineering at the University of Ilorin (2021-2026)
- Work experience: Queryfier LLC (ML Engineer, Jan 2026 - Present), CAMLDS (ML Engineer Intern, Mar 2025 - Dec 2025)

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
  const { message, mode, history } = req.body || {};

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
      const pinecone = new Pinecone({ apiKey: pineconeApiKey });
      const index = pinecone.index(pineconeIndexName);
      const openai = new OpenAI({
        apiKey: apiKey,
        baseURL: "https://integrate.api.nvidia.com/v1",
      });

      const embedResponse = await openai.embeddings.create({
        model: "nvidia/llama-nemotron-embed-vl-1b-v2",
        input: `Represent this query for retrieving relevant passages: ${trimmedMessage}`,
        encoding_format: "float",
      });
      const embedding = embedResponse.data[0].embedding;

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
          if (meta.liveUrl && meta.liveUrl !== "#") text += `\nLive Demo Link: ${meta.liveUrl}`;
          if (meta.githubUrl) text += `\nGitHub Code Link: ${meta.githubUrl}`;
          if (meta.url && meta.url !== "#") text += `\nExternal URL Link: ${meta.url}`;

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
        }
      }
    } catch (err) {
      console.warn("[RAG Warn] Pinecone retrieval skipped/failed, falling back to local KB:", err.message);
    }
  }

  // Fallback to local portfolio KB if Pinecone context is empty
  if (!retrievedContext) {
    const local = getLocalContext(trimmedMessage);
    retrievedContext = local.context;
    sources = local.sources;
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
    const reply = await generateChatReply({
      apiKey,
      systemPrompt: finalSystemPrompt,
      history: Array.isArray(history) ? history : [],
      userMessage: trimmedMessage,
    });

    return res.status(200).json({ reply, sources });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({
      error: "Something went wrong. Please try again later.",
    });
  }
}
