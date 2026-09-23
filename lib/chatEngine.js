/**
 * Shared LangChain Chat Engine
 * Used by both the Vercel serverless function (api/chat.js) and the Vite dev plugin
 * (plugins/chatApiPlugin.js) to avoid duplicating chat logic.
 *
 * Provides conversation memory by accepting a history array and injecting it
 * into the LangChain prompt chain alongside the system prompt and current message.
 */

import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";

const MODEL = "google/gemma-2-2b-it";
const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
const MAX_TOKENS = 400;
const TEMPERATURE = 0.4;

// Keep the last N exchanges (1 exchange = user + assistant pair) to stay
// within gemma-2-2b-it's context window while providing conversational continuity
const MAX_HISTORY_EXCHANGES = 8;

/**
 * Convert the client-supplied message history (plain {role, content} objects)
 * into LangChain message objects. Limits to the most recent exchanges so the
 * prompt fits within the model's context window.
 *
 * @param {Array<{role: string, content: string}>} rawHistory
 * @returns {Array<HumanMessage|AIMessage>}
 */
function formatHistory(rawHistory) {
  if (!Array.isArray(rawHistory) || rawHistory.length === 0) return [];

  // Take only the most recent N exchanges (N*2 messages for user+assistant pairs)
  const recent = rawHistory.slice(-(MAX_HISTORY_EXCHANGES * 2));

  return recent
    .map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "assistant") return new AIMessage(msg.content);
      return null;
    })
    .filter(Boolean);
}

/**
 * Generate a chat reply using LangChain with conversation memory.
 *
 * NVIDIA's gemma-2-2b-it does NOT support the "system" role — the API rejects it.
 * We work around this by injecting the system prompt into a HumanMessage, matching
 * the approach the original code used (system prompt + user question in one message).
 *
 * Message layout (system prompt always bundled with the current user message):
 *
 *   Turn 1 (no history):
 *     [Human]  systemPrompt + "User question: {msg}"
 *
 *   Turn 2 (1 prior exchange in history):
 *     [Human]  "What projects has John built?"         ← from history
 *     [AI]     "John has built..."                     ← from history
 *     [Human]  systemPrompt + "User question: {msg}"   ← current, carries persona
 *
 * @param {Object} params
 * @param {string} params.apiKey - NVIDIA API key
 * @param {string} params.systemPrompt - Full system prompt (persona + RAG context + mode directives)
 * @param {Array<{role: string, content: string}>} [params.history=[]] - Previous messages from the client
 * @param {string} params.userMessage - The current user message
 * @returns {Promise<string>} The assistant's reply text
 */
export async function generateChatReply({ apiKey, systemPrompt, history = [], userMessage }) {
  const model = new ChatOpenAI({
    apiKey,
    configuration: { baseURL: NVIDIA_BASE_URL },
    modelName: MODEL,
    temperature: TEMPERATURE,
    maxTokens: MAX_TOKENS,
    topP: 0.7,
  });

  const formattedHistory = formatHistory(history);

  // Build messages manually — no system role, since gemma-2-2b-it rejects it.
  //
  // We always bundle the system prompt into the CURRENT user message (matching
  // the original single-message pattern). This avoids two problems at once:
  //   1. No "system" role needed
  //   2. No consecutive same-role messages (NVIDIA rejects user/user or
  //      assistant/assistant sequences)
  //
  // The history already alternates user/assistant/..., so tacking one final
  // HumanMessage onto the end preserves the alternation.
  const messages = [
    ...formattedHistory,
    new HumanMessage(`${systemPrompt}\n\nUser question: ${userMessage}`),
  ];

  const response = await model.invoke(messages);

  return response.content?.trim() || "I couldn't generate a response right now.";
}
