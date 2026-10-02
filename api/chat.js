// Vercel Serverless Function — POST /api/chat
// Proxies chat messages to NVIDIA NIM with Pinecone RAG retrieval
// and LangChain conversation memory.
// NVIDIA_API_KEY, PINECONE_API_KEY, and PINECONE_INDEX_NAME are set in Environment Variables.

import { Pinecone } from "@pinecone-database/pinecone";
import { generateChatReply } from "../lib/chatEngine.js";
import { portfolioKB } from "../data/portfolio-kb.js";

const MAX_MESSAGE_LENGTH = 1000;
const NVIDIA_EMBEDDINGS_URL = "https://integrate.api.nvidia.com/v1/embeddings";
const EMBED_MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2";

export function getLocalContext(query) {
  // Common grammatical stop words to ignore in keyword scoring.
  // Note: domain words like 'projects', 'built', 'recent', 'latest', 'work' are intentionally preserved!
  const stopwords = new Set([
    "what", "is", "the", "and", "for", "with", "about", "tell", "can", "you",
    "does", "have", "any", "how", "who", "are", "his", "her", "their", "this",
    "that", "me", "give", "show", "was", "been", "were", "where", "which"
  ]);

  const cleaned = (query || "").toLowerCase().replace(/[^\w\s]/g, " ");
  const allTokens = cleaned.split(/\s+/).filter((t) => t.length > 1);
  const keywords = allTokens.filter((t) => !stopwords.has(t) && t.length > 2);
  const tokensToUse = keywords.length > 0 ? keywords : allTokens;

  const isGeneralProjectQuery = tokensToUse.some((t) =>
    ["project", "projects", "built", "portfolio", "work", "recent", "latest", "new", "all"].includes(t)
  );

  const isRecentIntent = tokensToUse.some((t) =>
    ["recent", "latest", "new", "newest", "recently"].includes(t)
  );

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

    // Boost the master projects catalog if this is a general project or portfolio query
    if (item.id === "projects-catalog" && isGeneralProjectQuery) {
      score += 15;
    }

    // Boost recent projects if user asks for recent/newest work
    if (isRecentIntent && (item.metadata?.tags || []).includes("recent")) {
      score += 10;
    }

    return { item, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const matched = scored.filter((s) => s.score > 0).slice(0, 6);
  const selected = matched.length > 0 ? matched.map((s) => s.item) : portfolioKB.slice(0, 6);

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

const SYSTEM_PROMPT = `You are John Aledare's portfolio assistant. John, also known as Jermaine or Jaykay, is an AI Engineer and Machine Learning Engineer who builds production-ready AI systems.

Core Background:
- Location: Nigeria | Education: B.Eng. in Computer Engineering, University of Ilorin (2021-2026).
- Experience: Machine Learning Engineer at Queryfier LLC (Jan 2026 - Present); ML Engineer Intern & Python Tutor at CAMLDS (Mar 2025 - Dec 2025).
- Contact: aledareoluwaseunjohn@gmail.com | Portfolio: https://aledare.vercel.app
- Socials: GitHub (https://github.com/Jaykay73), LinkedIn (https://www.linkedin.com/in/johnaledare), Twitter (https://x.com/Jermaine_73).

Complete Project Directory (All projects John has built):

1. Recent & Flagship Systems (2025–2026):
- SupplyPilot (Autonomous AI Operations & Supply Chain Platform):
  Autonomous AI operations and decision-support platform for pharmaceutical manufacturing. Simulates a 5-stage upstream-to-downstream disruption cascade, bridges operational silos, and automates verified purchase requisitions. Integrates LangGraph state machines, SOP policy RAG retrieval, Jev AI probabilistic risk analysis, deterministic Python rules engine for invariant compliance, and Human-in-the-Loop (HITL) RBAC governance.
  Live Demo: https://supply-pilot-three.vercel.app/ | GitHub: https://github.com/Jaykay73/SupplyPilot

- BitCheck (Multimodal Media Integrity & AI Verification API):
  Multi-signal forensic API analyzing text, images, video, and audio for AI generation and manipulation. Combines metadata validation, C2PA Content Credentials (c2patool), OCR watermark detection, deep learning (PyTorch EfficientNet-B0 trained on 140,000 images) with Grad-CAM explainability, audio voice clone forensics, and LLM text markers. Deployed with FastAPI & Docker on Hugging Face Spaces.
  Live Demo: https://bitcheckapp.vercel.app/ | GitHub: https://github.com/Jaykay73/bitcheck

- Diabetic Retinopathy Classifier (Medical Computer Vision):
  Deep learning web application detecting and grading diabetic retinopathy from retina fundus scans using PyTorch and fine-tuned EfficientNet-B0, featuring Grad-CAM visual heatmaps for clinical explainability.
  Live Demo: https://diabetic-retinopathy-m.streamlit.app/ | GitHub: https://github.com/Jaykay73/Diabetes

- LockedIn AI Service (Autonomous Learning Roadmap Generator):
  Standalone FastAPI AI backend generating customized beginner-to-advanced learning roadmaps for any topic. Integrates Tavily Search and YouTube APIs for candidate extraction, filtering out paywalled/duplicate links, uses DeepSeek LLM, Pydantic v2 schemas, and SQLite query caching.
  Live Demo: https://lockedin4l.vercel.app/ | GitHub: https://github.com/Jaykay73/LockedIn

- Nigerian Pidgin Next-Word Predictor (African Language Modeling):
  Real-time NLP system predicting subsequent words in Nigerian Pidgin English. Dual-model architecture: custom LSTM neural network for deep contextual modeling and statistical Trigram for ultra-low latency ranking, served via FastAPI with debounced Streamlit UI.
  Live Demo: https://nextword-pidgin.streamlit.app/ | GitHub: https://github.com/Jaykay73/nextword-pidgin

- Flappy Bird RL (Policy Search & Control):
  Reinforcement learning benchmark exploring tabular Q-Learning (with discrete state abstraction and reward shaping), Deep RL (Proximal Policy Optimization - PPO in PyTorch), NEAT (neuroevolution), and Genetic Algorithms in Gymnasium.
  GitHub: https://github.com/Jaykay73/flappy-bird

- AI Resume Optimizer & Career Architect (Career Tech / NLP):
  Automated career coach analyzing resume-to-job-description skill gaps with 95% parsing accuracy. Generates tailored cover letters via Google Gemini 2.0 Flash and accelerates NER inference via ONNX quantization. Built with Next.js, FastAPI, and Docker.
  Live Demo: https://aicareerarchitect.vercel.app | GitHub: https://github.com/Jaykay73/resume-optimizer

2. Production Machine Learning & Specialized Systems:
- CineMatch API (Semantic Vector Search Recommendation Engine):
  Movie recommendation API using MiniLM dense embeddings and FAISS index (<100ms similarity retrieval) with automated TMDB sync and vibe-based discovery.
  Live Demo: https://aether-match.vercel.app | GitHub: https://github.com/Jaykay73/CineMatch

- Brain Tumor MRI Classifier (Deep Learning Medical Diagnostics):
  Multi-class brain tumor classification (Glioma, Meningioma, Pituitary, No Tumor) from MRI scans using EfficientNetB0 transfer learning. Quantized for mobile edge deployment and hosted on Streamlit Cloud.
  Live Demo: https://mri-scan.streamlit.app/ | GitHub: https://github.com/Jaykay73/MRI-Scan

- Legal Document Analyzer (RAG Contract Analysis):
  NLP contract analysis tool extracting clauses and scoring obligations using SentenceTransformers chunk embeddings and cosine similarity ranking in Streamlit.
  GitHub: https://github.com/Jaykay73/Legal-Document-Analyser

- Bank Customer Churn Prediction (Predictive ML):
  Interactive ML web application predicting bank customer churn using Gradient Boosting with feature scaling and hyperparameter tuning in Streamlit.
  Live Demo: https://jaykay-bank-churn.streamlit.app/ | GitHub: https://github.com/Jaykay73/Bank-Customer-Churn-Prediction

- Credit Card Fraud Detection (Unsupervised Anomaly Detection):
  Anomaly detection on heavily imbalanced transactions using Isolation Forest and Deep Autoencoders (TensorFlow) with PCA/t-SNE latent space visualizers.
  GitHub: https://github.com/jaykay73/credit-card-fraud-detection

3. Additional Agent & Applied Systems:
- FPL Gaffer (Fantasy Premier League WhatsApp AI Agent): LangGraph, LangChain, FastAPI webhooks, Tavily, Groq. GitHub: https://github.com/DejusDevspace/fpl-gaffer
- Personal Learning Assistant: Conversational Q&A chatbot with YouTube summarization using LangChain and FAISS. GitHub: https://github.com/DejusDevspace/Personal-Leaning-Assistant-Q-A-Conversational-Chatbot
- Beans Disease Detection Model: Plant pathology CNN on Raspberry Pi edge hardware. GitHub: https://github.com/DejusDevspace/bean-disease-classification
- BAES Elections WebApp: Full-stack voting system with React, Express, and Supabase. GitHub: https://github.com/DejusDevspace/baes-election-website

Answer guidelines:
- Answer questions about John's skills, projects, experience, and engineering approach thoroughly, concisely, and accurately.
- When asked about John's projects, recent projects, or what he has built, showcase his recent flagship systems (BitCheck, Diabetic Retinopathy Classifier, LockedIn, Nigerian Pidgin Next-Word Predictor, Flappy Bird RL, AI Resume Optimizer) alongside his other specialized systems.
- HYPERLINK RESOLUTION: Whenever you discuss or mention any project that has a Live Demo or GitHub link, you MUST include clickable Markdown links (e.g. [Live Demo](URL) and/or [GitHub Repo](URL)).`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    console.error("NVIDIA_API_KEY is not configured");
    return res.status(500).json({ error: "Chat service is not configured. Please try again later." });
  }

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

  // 1. Perform Pinecone Vector RAG if configured
  if (pineconeApiKey && pineconeIndexName) {
    try {
      const pinecone = new Pinecone({ apiKey: pineconeApiKey });
      const index = pinecone.index(pineconeIndexName);

      const embedRes = await fetch(NVIDIA_EMBEDDINGS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: EMBED_MODEL,
          input: `Represent this query for retrieving relevant passages: ${trimmedMessage}`,
          input_type: "query",
          encoding_format: "float",
        }),
      });

      if (embedRes.ok) {
        const embedData = await embedRes.json();
        const embedding = embedData?.data?.[0]?.embedding;

        if (Array.isArray(embedding) && embedding.length === 2048) {
          const queryResponse = await index.namespace("portfolio").query({
            vector: embedding,
            topK: 6,
            includeMetadata: true,
          });

          if (queryResponse?.matches?.length > 0) {
            const matches = queryResponse.matches.filter(
              (m) => m.score > 0.25 && m.metadata && m.metadata.text
            );

            const formattedMatches = matches.map((match) => {
              const meta = match.metadata;
              let text = `[Source: ${meta.title || "General"}] ${meta.text.trim()}`;
              if (meta.liveUrl && meta.liveUrl !== "#") text += `\nLive Demo Link: ${meta.liveUrl}`;
              if (meta.githubUrl && meta.githubUrl !== "#") text += `\nGitHub Code Link: ${meta.githubUrl}`;
              if (meta.url && meta.url !== "#") text += `\nExternal URL Link: ${meta.url}`;

              const sourceUrl = (meta.liveUrl && meta.liveUrl !== "#") ? meta.liveUrl : (meta.githubUrl !== "#" ? meta.githubUrl : meta.url);
              if (sourceUrl && sourceUrl !== "#" && !sources.some((s) => s.url === sourceUrl)) {
                sources.push({
                  title: meta.title || "Reference",
                  type: meta.type || "reference",
                  url: sourceUrl,
                });
              }
              return text;
            });

            if (formattedMatches.length > 0) {
              retrievedContext = formattedMatches.join("\n\n");
            }
          }
        }
      }
    } catch (err) {
      console.warn("[RAG Warn] Pinecone retrieval skipped/failed, falling back to local KB:", err.message);
    }
  }

  // 2. Fallback or augment with local portfolio KB
  if (!retrievedContext) {
    const local = getLocalContext(trimmedMessage);
    retrievedContext = local.context;
    sources = local.sources;
  }

  // 3. Construct Dynamic RAG Prompt (Retains comprehensive baseline SYSTEM_PROMPT)
  let finalSystemPrompt = SYSTEM_PROMPT;
  if (retrievedContext) {
    finalSystemPrompt += `\n\n--- DETAILED RETRIEVED CONTEXT FROM KNOWLEDGE BASE ---\n${retrievedContext}\n------------------------------------------------------\nUse both the comprehensive directory above and the retrieved context to answer the user's question accurately. Remember to provide clickable markdown hyperlinks for any referenced project demo or repository.`;
  }

  // 4. Apply Recruiter / Hire Mode directive if active
  if (mode === "hire") {
    finalSystemPrompt += `\n\n--- 💼 RECRUITER MODE DIRECTIVE (CRITICAL) ---
The user is a recruiter, hiring manager, or potential client.
- You MUST prioritize showcasing John's technical strengths, production engineering standards, and readiness to join remote, hybrid, or on-site engineering teams.
- Highlight his recent production-deployed systems: SupplyPilot (autonomous AI operations & LangGraph supply chain platform), BitCheck (cybersecurity multimodal forensics API), Diabetic Retinopathy Classifier (explainable clinical vision), LockedIn AI Service (LLM roadmap generator), and Pidgin Next-Word Predictor.
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
