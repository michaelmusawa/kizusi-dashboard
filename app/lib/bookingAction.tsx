import pool from "./db";

export async function getBookingById(id: string) {
  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'addonId', a.id,
            'addonName', a."addonName",
            'addonValue', a."addonValue"
          )
        ) AS "addons" -- Aggregate addons into an array of JSON objects
      FROM "Booking" b
      LEFT JOIN "BookingAddon" ba ON b.id = ba."bookingId"
      LEFT JOIN "Addon" a ON ba."addonId" = a.id
      WHERE b.id = $1
      GROUP BY b.id
      `,
      [id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error;
  }
}

export async function fetchFilteredBookings(filter: string, query: string) {
  try {
    const result = await pool.query(
      `
      SELECT b.*, c.name AS "carName"
      FROM "Booking" b
      JOIN "Car" c ON b."carId" = c.id
      WHERE b."userId" = $1 AND 
      (
      b.departure ILIKE $2 OR
      b.destination ILIKE $2 OR
      CAST(b.amount AS TEXT) ILIKE $2 OR
      b."bookType" ILIKE $2 OR
       b."bookingStatus" ILIKE $2 OR
        b."paymentStatus" ILIKE $2 OR
        c.name ILIKE $2 OR
        b."paymentType" ILIKE $2

      )
      `,
      [filter, `%${query}%`]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching filtered bookings:", error);
    throw error;
  }
}

export async function cancelBookingById(id: string) {
  try {
    const result = await pool.query(
      `
      UPDATE "Booking"
      SET "bookingStatus" = $1
      WHERE id = $2
      RETURNING *;
    `,
      ["CANCELLED", id]
    );

    return result.rows[0]; // Returns the updated booking
  } catch (error) {
    console.error("Error cancelling booking by ID:", error);
    throw error;
  }
}
