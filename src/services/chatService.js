/**
 * Chat Service — Handles communication with the portfolio chatbot backend.
 *
 * Architecture note:
 * This service is structured so RAG retrieval can be added as a middleware
 * step. In the future, before calling sendMessage(), you could:
 * 1. Embed the user query
 * 2. Retrieve relevant chunks from portfolio-kb
 * 3. Append context to the message or send separately
 */

const CHAT_API_URL = "/api/chat";
const REQUEST_TIMEOUT = 20000;

/**
 * Send a message to the portfolio chatbot.
 * @param {string} message — The user's message
 * @returns {Promise<string>} — The assistant's reply
 */
export async function sendMessage(message) {
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
      body: JSON.stringify({ message: trimmed }),
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
    return data.reply || "I couldn't generate a response.";
  } catch (err) {
    clearTimeout(timeoutId);

    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    throw err;
  }
}

/**
 * Future: Retrieve relevant context from knowledge base before LLM call.
 * This is a placeholder for RAG integration.
 *
 * @param {string} query — The user's question
 * @returns {Promise<string[]>} — Relevant context chunks
 */
export async function retrieveContext(query) {
  // TODO: Implement vector similarity search against portfolio-kb
  // 1. Embed the query using a sentence transformer
  // 2. Search against pre-computed embeddings of portfolio-kb entries
  // 3. Return top-k relevant chunks
  return [];
}
