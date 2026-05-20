import "dotenv/config";
import { portfolioKB } from "../data/portfolio-kb.js";
import { embedPassage } from "../lib/nvidia.ts";
import { portfolioIndex } from "../lib/pinecone.ts";

async function embedWithRetry(text: string, retries = 3, delay = 2000): Promise<number[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await embedPassage(text);
    } catch (error: any) {
      if (attempt === retries) throw error;
      console.warn(`[Embedding Warning] Attempt ${attempt} failed: ${error.message || error}. Retrying in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
  throw new Error("Failed to embed passage after retries");
}

async function main() {
  console.log("Updating portfolio knowledge base...");

  const records = [];

  for (const item of portfolioKB) {
    const embedding = await embedWithRetry(item.text);

    console.log(`Embedded: ${item.title} | Dimension: ${embedding.length}`);

    records.push({
      id: item.id,
      values: embedding,
      metadata: {
        type: item.type,
        title: item.title,
        text: item.text,
        ...item.metadata,
      },
    });
  }

  await portfolioIndex.namespace("portfolio").upsert({ records });

  console.log(`Upserted ${records.length} records to Pinecone.`);
}

main().catch((error) => {
  console.error("KB update failed:", error);
  process.exit(1);
});