import OpenAI from "openai";

export const nvidia = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function embedPassage(text: string) {
  const response = await nvidia.embeddings.create({
    model: "nvidia/nv-embed-v1",
    input: `Represent this passage for retrieval: ${text}`,
  });

  return response.data[0].embedding;
}

export async function embedQuery(text: string) {
  const response = await nvidia.embeddings.create({
    model: "nvidia/nv-embed-v1",
    input: `Represent this query for retrieving relevant passages: ${text}`,
  });

  return response.data[0].embedding;
}