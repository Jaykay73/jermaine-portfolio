/**
 * Shared Chat Engine
 * Used by both the Vercel serverless function (api/chat.js) and the Vite dev plugin
 * (plugins/chatApiPlugin.js).
 *
 * Uses Meta Llama 3.2 11B Vision Instruct on NVIDIA NIM with conversation memory.
 */

const MODEL = "meta/llama-3.2-11b-vision-instruct";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MAX_TOKENS = 500;
const TEMPERATURE = 0.4;
const MAX_HISTORY_EXCHANGES = 8;

/**
 * Format conversation history to valid OpenAI/NVIDIA chat messages.
 *
 * @param {Array<{role: string, content: string}>} rawHistory
 * @returns {Array<{role: string, content: string}>}
 */
function formatHistory(rawHistory) {
  if (!Array.isArray(rawHistory) || rawHistory.length === 0) return [];

  const recent = rawHistory.slice(-(MAX_HISTORY_EXCHANGES * 2));

  return recent
    .filter((msg) => msg && typeof msg.content === "string" && (msg.role === "user" || msg.role === "assistant"))
    .map((msg) => ({
      role: msg.role,
      content: msg.content.trim(),
    }));
}

/**
 * Generate a chat reply with conversation memory using NVIDIA NIM API.
 *
 * @param {Object} params
 * @param {string} params.apiKey - NVIDIA API key
 * @param {string} params.systemPrompt - Full system prompt (persona + RAG context + mode directives)
 * @param {Array<{role: string, content: string}>} [params.history=[]] - Previous messages from the client
 * @param {string} params.userMessage - The current user message
 * @returns {Promise<string>} The assistant's reply text
 */
export async function generateChatReply({ apiKey, systemPrompt, history = [], userMessage }) {
  const formattedHistory = formatHistory(history);

  const messages = [
    { role: "system", content: systemPrompt },
    ...formattedHistory,
    { role: "user", content: userMessage.trim() },
  ];

  const response = await fetch(NVIDIA_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: MAX_TOKENS,
      temperature: TEMPERATURE,
      top_p: 0.7,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`NVIDIA API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return (
    data?.choices?.[0]?.message?.content?.trim() ||
    "I'm sorry, I couldn't generate a response right now."
  );
}
