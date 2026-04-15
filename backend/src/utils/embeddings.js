import OpenAI from "openai";
import { config } from "../config/config.js";

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

/**
 * Generate embedding from text
 */
export const generateEmbedding = async (text) => {
  if (!text) return [];

  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });

  return response.data[0].embedding;
};
