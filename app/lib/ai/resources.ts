"use server";

import pool from "../db";
import { generateEmbeddings } from "../ai/embedding";

// Define the input type
interface NewResourceParams {
  content: string;
}

// Function to add a new resource with embeddings (PostgreSQL version)
export const createResource = async (
  input: NewResourceParams
): Promise<string> => {
  try {
    const { content } = input;

    // Insert resource content into the database and get the new ID
    const insertText = `
      INSERT INTO "Resource" (content)
      VALUES ($1)
      RETURNING id;
    `;
    const insertResult = await pool.query<{ id: number }>(insertText, [
      content,
    ]);
    const resourceId = insertResult.rows[0].id;

    // Generate embeddings for the content
    const embeddings = await generateEmbeddings(content);

    // Store embeddings in the database
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
    // Return specific error message if available
    if (error instanceof Error && error.message) {
      return error.message;
    }
    return "Error, please try again.";
  }
};
