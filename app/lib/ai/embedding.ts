"use server";

import pool from "../db";
import { pipeline } from "@xenova/transformers";

// Initialize embedding model
const embeddingModel = await pipeline(
  "feature-extraction",
  "Xenova/all-MiniLM-L6-v2"
);

// Define the input type
interface NewResourceParams {
  content: string;
}

// Helper to generate chunks from input text
const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split(".")
    .filter((i) => i !== "");
};

// Generate embeddings for multiple chunks
export const generateEmbeddings = async (
  value: string
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const embeddings = await Promise.all(
    chunks.map(async (chunk) => {
      const output = await embeddingModel(chunk, {
        pooling: "mean",
        normalize: true,
      });
      return Array.from(output.data);
    })
  );
  return chunks.map((content, i) => ({ content, embedding: embeddings[i] }));
};

// Generate a single embedding
export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const output = await embeddingModel(input, {
    pooling: "mean",
    normalize: true,
  });
  return Array.from(output.data);
};

// Function to add a new resource with embeddings (PostgreSQL version)
export const createResource = async (
  input: NewResourceParams
): Promise<string> => {
  try {
    const { content } = input;

    const insertText = `
      INSERT INTO "Resource" (content)
      VALUES ($1)
      RETURNING id;
    `;
    const insertResult = await pool.query<{ id: number }>(insertText, [
      content,
    ]);
    const resourceId = insertResult.rows[0].id;

    const embeddings = await generateEmbeddings(content);

    const embedText = `
      INSERT INTO "Embedding" ("resourceId", vector)
      VALUES ($1, $2);
    `;

    for (const { embedding } of embeddings) {
      await pool.query(embedText, [resourceId, JSON.stringify(embedding)]);
    }

    return "Resource successfully created and embedded.";
  } catch (error) {
    console.error("Error adding resource:", error);
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return "Error, please try again.";
  }
};

// Find relevant content based on a user's query
export async function findRelevantContent(
  userQuery: string
): Promise<{ content: string; similarity: number }[] | string> {
  try {
    const userQueryEmbedded = await generateEmbedding(userQuery);

    const result = await pool.query(
      `
      SELECT e.vector, r.content
      FROM "Embedding" e
      JOIN "Resource" r ON e."resourceId" = r.id
      `
    );

    const results = result.rows
      .map((row) => {
        const storedVector = JSON.parse(row.vector) as number[];
        const similarity = cosineSimilarity(userQueryEmbedded, storedVector);
        return { content: row.content, similarity };
      })
      .filter(({ similarity }) => similarity > 0.35)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 4);

    return results.length > 0 ? results : "Sorry, I don't know.";
  } catch (error) {
    console.error("Error finding relevant content:", error);
    return "Error retrieving relevant content.";
  }
}

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a ** 2, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b ** 2, 0));
  return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0;
};
