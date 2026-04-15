import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/config.js";

const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

/**
 * Generate embedding using Gemini
 */
export const generateEmbedding = async (text) => {
  try {
    if (!text) return [];

    const model = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const result = await model.embedContent(text);

    return result.embedding.values;
  } catch (error) {
    console.error("Embedding error:", error.message);
    return [];
  }
};
