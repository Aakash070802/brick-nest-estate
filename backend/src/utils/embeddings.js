import OpenAI from "openai";
import { config } from "../config/config.js";

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const cache = new Map(); // 🔥 cache for performance

export const generateEmbedding = async (text) => {
  try {
    if (!text) return [];

    // ✅ CACHE HIT
    if (cache.has(text)) {
      return cache.get(text);
    }

    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    const vector = response.data[0].embedding;

    // ✅ store in cache
    cache.set(text, vector);

    console.log("Embedding generated:", vector.length);

    return vector;
  } catch (error) {
    console.error("Embedding error:", error.message);
    return [];
  }
};
