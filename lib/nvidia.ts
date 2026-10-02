const NVIDIA_EMBEDDINGS_URL = "https://integrate.api.nvidia.com/v1/embeddings";
const EMBED_MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2";

interface EmbeddingResponse {
  data: Array<{
    embedding: number[];
    index: number;
  }>;
}

export async function embedPassage(text: string): Promise<number[]> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured in environment");
  }

  const response = await fetch(NVIDIA_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: text,
      input_type: "passage",
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`NVIDIA Embedding API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as EmbeddingResponse;
  if (!data?.data?.[0]?.embedding) {
    throw new Error("Invalid response format from NVIDIA Embedding API");
  }

  return data.data[0].embedding;
}

export async function embedQuery(text: string): Promise<number[]> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    throw new Error("NVIDIA_API_KEY is not configured in environment");
  }

  const response = await fetch(NVIDIA_EMBEDDINGS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBED_MODEL,
      input: `Represent this query for retrieving relevant passages: ${text}`,
      input_type: "query",
      encoding_format: "float",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`NVIDIA Embedding API error ${response.status}: ${errorText}`);
  }

  const data = (await response.json()) as EmbeddingResponse;
  if (!data?.data?.[0]?.embedding) {
    throw new Error("Invalid response format from NVIDIA Embedding API");
  }

  return data.data[0].embedding;
}