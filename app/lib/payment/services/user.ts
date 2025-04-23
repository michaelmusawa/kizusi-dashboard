import pool from "../../db";

export async function ensureUserExists(params: {
  userId: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}) {
  const { userId, name, email, phone, image } = params;
  const client = await pool.connect();
  try {
    const { rowCount } = await client.query(
      `SELECT 1 FROM "User" WHERE id = $1`,
      [userId]
    );
    if (rowCount === 0) {
      await client.query(
        `INSERT INTO "User"(id,name,email,phone,image,"clerkId") VALUES($1,$2,$3,$4,$5,$6)`,
        [userId, name, email, phone, image, userId]
      );
    }
  } finally {
    client.release();
  }
}
