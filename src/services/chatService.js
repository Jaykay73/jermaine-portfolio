/**
 * Chat Service — Handles communication with the portfolio chatbot backend.
 *
 * Conversation memory is handled by sending the full message history with each
 * request. The backend (via LangChain) injects this history into the prompt so
 * the model can maintain conversational continuity across multiple turns.
 */

const CHAT_API_URL = "/api/chat";
const REQUEST_TIMEOUT = 20000;

/**
 * Send a message to the portfolio chatbot with conversation history.
 *
 * @param {string} message — The user's current message
 * @param {string} mode — "default" or "hire"
 * @param {Array<{role: string, content: string}>} history — Previous messages in the conversation
 * @returns {Promise<{reply: string, sources: Array}>} — The assistant's reply and RAG sources
 */
export async function sendMessage(message, mode = "default", history = []) {
  const trimmed = (message || "").trim();

  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }

  if (trimmed.length > 1000) {
    throw new Error("Message is too long. Maximum 1000 characters.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(CHAT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: trimmed, mode, history }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error || `Server error (${response.status}). Please try again.`
      );
    }

    const data = await response.json();
    return {
      reply: data.reply || "I couldn't generate a response.",
      sources: data.sources || [],
    };
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw err;
  }
}

/**
 * Note: RAG Pipeline is implemented securely on the server-side.
 * Performing vector similarity search in api/chat.js (production) and
 * plugins/chatApiPlugin.js (development) protects sensitive credentials
 * (Pinecone & NVIDIA API keys) from client-side exposure.
 */
