"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import {
  BookingActionState,
  BookingData,
  BookingState,
  CarActionState,
  CarState,
  CategoryActionState,
  CategoryState,
  TransactionState,
  User,
} from "./definitions";
import pool from "./db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { formatCurrency } from "./utils";

export async function authenticate(_currentState: unknown, formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res.error) {
      redirect("/dashboard");
    }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error;
  }
}

export async function getUser(email: string): Promise<User | undefined> {
  try {
    const result = await pool.query<User>(
      `
      SELECT * FROM "User"
      WHERE email = $1
    `,
      [email]
    );

    // Return the first user, or undefined if no users are found
    return result.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

const CarFormSchema = z.object({
  name: z.string(),
  brand: z.string(),
  category: z.string(),
  price: z.coerce.number(),
  image: z.string(),
  description: z.string(),
  addon: z.array(
    z.object({
      name: z.string(),
      value: z.coerce.number(),
    })
  ),
  feature: z.array(
    z.object({
      name: z.string(),
      value: z.string(),
    })
  ),
});

export async function createCar(
  prevState: CarActionState,
  formData: FormData
): Promise<CarActionState> {
  const validatedFields = CarFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    image: formData.get("image"),
    description: formData.get("description"),
    price: formData.get("price"),
    addon: formData.getAll("addon").map((addon, index) => ({
      name: addon,
      value: formData.getAll("value")[index],
    })),
    feature: formData.getAll("feature").map((feature, index) => ({
      name: feature,
      value: formData.getAll("value")[index],
    })),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Car.",
    };
  }

  const { name, brand, category, image, description, price, addon, feature } =
    validatedFields.data;
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch brand ID from brand name
    const brandResult = await client.query(
      `SELECT id FROM "Brand" WHERE name = $1`,
      [brand]
    );
    if (brandResult.rows.length === 0) {
      throw new Error(`Brand "${brand}" not found.`);
    }
    const brandId = brandResult.rows[0].id;

    // Fetch category ID from category name
    const categoryResult = await client.query(
      `SELECT id FROM "Category" WHERE name = $1`,
      [category]
    );
    if (categoryResult.rows.length === 0) {
      throw new Error(`Category "${category}" not found.`);
    }
    const categoryId = categoryResult.rows[0].id;

    // Insert the car
    const carResult = await client.query(
      `INSERT INTO "Car" (name, "brandId", "categoryId", description, price, "imageUrl") 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id`,
      [name, brandId, categoryId, description, price, image]
    );

    const carId = carResult.rows[0].id;

    // Insert features if provided
    if (feature?.length) {
      const featureValues = feature
        .map((f) => `(${carId}, '${f.name}', '${f.value}')`)
        .join(",");
      await client.query(
        `INSERT INTO "Feature" ("carId", "featureName", "featureValue") 
           VALUES ${featureValues}`
      );
    }

    // Insert addons if provided
    if (addon?.length) {
      const addonValues = addon
        .map((a) => `(${carId}, '${a.name}', '${a.value}')`)
        .join(",");
      await client.query(
        `INSERT INTO "Addon" ("carId", "addonName", "addonValue") 
           VALUES ${addonValues}`
      );
    }

    await client.query("COMMIT");

    revalidatePath("/dashboard/cars/create");
    return {
      message: "Car created successfully",
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating car:", error);
    return { state_error: "Error creating car" };
  } finally {
    client.release();
  }
}

export async function getCarById(id: number): Promise<CarState> {
  try {
    const result = await pool.query(
      `
      SELECT 
        car.id ,
        car.name,
        car.price,
        car."imageUrl" AS image,
        car.description,
        JSONB_BUILD_OBJECT('brandId', b.id, 'brandName', b.name) AS brand,
        JSONB_BUILD_OBJECT('id', c.id, 'name', c.name) AS category,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('featureId', f.id, 'featureName', f."featureName", 'featureValue', f."featureValue")
          ) FILTER (WHERE f.id IS NOT NULL), '[]'::jsonb
        ) AS features,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('addonId', a.id, 'addonName', a."addonName", 'addonValue', a."addonValue")
          ) FILTER (WHERE a.id IS NOT NULL), '[]'::jsonb
        ) AS addons
      FROM "Car" car
      LEFT JOIN "Brand" b ON car."brandId" = b.id
      LEFT JOIN "Category" c ON car."categoryId" = c.id
      LEFT JOIN "Feature" f ON car.id = f."carId"
      LEFT JOIN "Addon" a ON car.id = a."carId"
      WHERE car.id = $1
      GROUP BY car.id, b.id, c.id
    `,
      [id]
    );

    return result.rows[0];
  } catch (error) {
    console.error("Error fetching car by ID:", error);
    throw error;
  }
}

const ITEMS_PER_PAGE = 10; // Adjust as needed

export async function fetchFilteredCars(
  query: string,
  currentPage: number
): Promise<CarState[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const result = await pool.query(
      `
      SELECT 
        car.id, 
        car.name,
        car.price,
        car."imageUrl" AS image,
        car.description,
        JSONB_BUILD_OBJECT('brandId', b.id, 'brandName', b.name) AS brand,
        JSONB_BUILD_OBJECT('categoryId', c.id, 'categoryName', c.name) AS category,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('featureId', f.id, 'featureName', f."featureName", 'featureValue', f."featureValue")
          ) FILTER (WHERE f.id IS NOT NULL), '[]'::jsonb
        ) AS features,
        COALESCE(
          JSONB_AGG(
            DISTINCT JSONB_BUILD_OBJECT('addonId', a.id, 'addonName', a."addonName", 'addonValue', a."addonValue")
          ) FILTER (WHERE a.id IS NOT NULL), '[]'::jsonb
        ) AS addons
      FROM "Car" car
      LEFT JOIN "Brand" b ON car."brandId" = b.id
      LEFT JOIN "Category" c ON car."categoryId" = c.id
      LEFT JOIN "Feature" f ON car.id = f."carId"
      LEFT JOIN "Addon" a ON car.id = a."carId"
      WHERE 
        car.name ILIKE $1 OR
        c.name ILIKE $1 OR
        b.name ILIKE $1 OR
        car.description ILIKE $1
      GROUP BY car.id, b.id, c.id
      ORDER BY car.name ASC
      LIMIT $2 OFFSET $3
    `,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching filtered cars:", error);
    throw error;
  }
}

export async function fetchCarPages(query: string) {
  try {
    const count = await pool.query(
      `
      SELECT COUNT(*)
      FROM "Car" car
      LEFT JOIN "Category" c ON car."categoryId" = c.id
      LEFT JOIN "Brand" b ON car."brandId" = b.id
      WHERE 
        car.name ILIKE $1 OR
        c.name ILIKE $1 OR
        b.name ILIKE $1 OR
        car.description ILIKE $1
    `,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Error fetching car pages:", error);
    throw error;
  }
}

export async function updateCar(
  id: number,
  prevState: CarActionState,
  formData: FormData
): Promise<CarActionState> {
  const validatedFields = CarFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    category: formData.get("category"),
    image: formData.get("image"),
    description: formData.get("description"),
    price: formData.get("price"),
    addon: formData.getAll("addon").map((addon, index) => ({
      name: addon,
      value: formData.getAll("value")[index],
    })),
    feature: formData.getAll("feature").map((feature, index) => ({
      name: feature,
      value: formData.getAll("value")[index],
    })),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Car.",
    };
  }

  const { name, brand, category, image, description, price, addon, feature } =
    validatedFields.data;

  try {
    // Start a transaction to ensure atomicity
    await pool.query("BEGIN");

    // Fetch brand ID from brand name
    const brandResult = await pool.query(
      `SELECT id FROM "Brand" WHERE name = $1`,
      [brand]
    );
    if (brandResult.rows.length === 0) {
      throw new Error(`Brand "${brand}" not found.`);
    }
    const brandId = brandResult.rows[0].id;

    // Fetch category ID from category name
    const categoryResult = await pool.query(
      `SELECT id FROM "Category" WHERE name = $1`,
      [category]
    );
    if (categoryResult.rows.length === 0) {
      throw new Error(`Category "${category}" not found.`);
    }
    const categoryId = categoryResult.rows[0].id;

    // Update car details
    const updateCarQuery = `
        UPDATE "Car"
        SET
          name = $1,
          price = $2,
          "imageUrl" = $3,
          description = $4,
          "brandId" = $5,
          "categoryId" = $6
        WHERE id = $7
        RETURNING id
      `;
    const updateCarResult = await pool.query(updateCarQuery, [
      name,
      price,
      image,
      description,
      brandId,
      categoryId,
      id,
    ]);

    if (updateCarResult.rows.length === 0) {
      throw new Error("Car not found");
    }

    // Remove old features and addons for this car
    const deleteFeaturesQuery = 'DELETE FROM "Feature" WHERE "carId" = $1';
    const deleteAddonsQuery = 'DELETE FROM "Addon" WHERE "carId" = $1';

    await pool.query(deleteFeaturesQuery, [id]);
    await pool.query(deleteAddonsQuery, [id]);

    // Insert new features
    for (const f of feature) {
      const insertFeatureQuery = `
          INSERT INTO "Feature" ("carId", "featureName", "featureValue")
          VALUES ($1, $2, $3)
        `;
      await pool.query(insertFeatureQuery, [id, f.name, f.value]);
    }

    // Insert new addons
    for (const a of addon) {
      const insertAddonQuery = `
          INSERT INTO "Addon" ("carId", "addonName", "addonValue")
          VALUES ($1, $2, $3)
        `;
      await pool.query(insertAddonQuery, [id, a.name, a.value]);
    }
    // Commit the transaction
    await pool.query("COMMIT");
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    console.error("Error updating car:", error);
    return { state_error: "Error updating car" };
  }
  redirect("/dashboard/cars?success=true");
}

export async function deleteCar(id: number): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Delete features related to the car
    await client.query(`DELETE FROM "Feature" WHERE "carId" = $1`, [id]);

    // Delete addons related to the car
    await client.query(`DELETE FROM "Addon" WHERE "carId" = $1`, [id]);

    // Now, delete the car itself
    const result = await client.query(
      `DELETE FROM "Car" WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length > 0) {
      console.log(
        `Car with ID ${id} and related features and addons deleted successfully.`
      );
      await client.query("COMMIT");
      return true; // Return true if the car was deleted
    } else {
      console.log(`Car with ID ${id} not found.`);
      await client.query("ROLLBACK");
      return false; // Return false if no car with the given ID was found
    }
  } catch (error) {
    console.error("Error deleting car by ID:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// --------  Category section --------------------

const CategoryFormSchema = z.object({
  name: z.string(),
  brand: z.array(z.string()),
  price: z.coerce.number(),
  image: z.string(),
  description: z.string(),
});

export async function createCategory(
  prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const validatedFields = CategoryFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.getAll("brand"),
    image: formData.get("image"),
    description: formData.get("description"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Category.",
    };
  }

  const { name, brand, image, description, price } = validatedFields.data;

  try {
    // 1️⃣ Insert brands
    const categoryResult = await pool.query(
      `INSERT INTO "Category" (name, price, "imageUrl", description) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id`,
      [name, price, image, description]
    );

    const categoryId = categoryResult.rows[0].id;

    for (const b of brand) {
      // Check if the brand exists
      const brandResult = await pool.query(
        `SELECT id FROM "Brand" WHERE name = $1`,
        [b]
      );

      let brandId;

      if (brandResult.rows.length > 0) {
        // Brand exists, get the ID
        brandId = brandResult.rows[0].id;
      } else {
        // Brand does not exist, insert it
        const newBrandResult = await pool.query(
          `INSERT INTO "Brand" (name) 
           VALUES ($1) 
           RETURNING id`,
          [b]
        );
        brandId = newBrandResult.rows[0].id;
      }

      // Associate brand with category
      await pool.query(
        `INSERT INTO "CategoryBrand" ("categoryId", "brandId") 
       VALUES ($1, $2) 
       ON CONFLICT DO NOTHING`,
        [categoryId, brandId]
      );
    }
    return { message: "Car created successfully" };
  } catch (error) {
    console.error("Error:", error);
    return { state_error: "Error creating category" };
  }
}
export async function getCategoryById(
  categoryId: number
): Promise<CategoryState> {
  try {
    const result = await pool.query(
      `
      SELECT 
        c.id AS "categoryId", 
        c.name AS "categoryName", 
        c.price, 
        c."imageUrl", 
        c.description, 
        ARRAY_AGG(
            JSON_BUILD_OBJECT('brandId', b.id, 'brandName', b.name)
        ) AS brands
      FROM "Category" c
      LEFT JOIN "CategoryBrand" cb ON c.id = cb."categoryId"
      LEFT JOIN "Brand" b ON cb."brandId" = b.id
      WHERE c.id = $1
      GROUP BY c.id
    `,
      [categoryId]
    );

    // Check if a category was found
    if (result.rows.length > 0) {
      return result.rows[0]; // Return the single category object
    } else {
      return null; // Return null if no category found
    }
  } catch (error) {
    console.error("Error fetching category by ID:", error);
    throw error; // Optionally rethrow the error for further handling
  }
}

export async function fetchFilteredCategories(
  query: string,
  currentPage: number
): Promise<CategoryState[]> {
  const ITEMS_PER_PAGE = 8;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const result = await pool.query(
      `
      SELECT 
        c.id, 
        c.name,
        c.price, 
        c."imageUrl" AS image, 
        c.description, 
        ARRAY_AGG(
            JSON_BUILD_OBJECT('brandId', b.id, 'brandName', b.name)
        ) AS brands
      FROM "Category" c
      LEFT JOIN "CategoryBrand" cb ON c.id = cb."categoryId"
      LEFT JOIN "Brand" b ON cb."brandId" = b.id
      WHERE c.name ILIKE $1
      GROUP BY c.id
      ORDER BY c.name ASC
      LIMIT $2 OFFSET $3
    `,
      [`%${query}%`, ITEMS_PER_PAGE, offset]
    );
    return result.rows;
  } catch (error) {
    console.error("Error fetching filtered categories:", error);
    throw new Error("Failed to fetch categories.");
  }
}

export async function fetchCategoryPages(query: string) {
  const ITEMS_PER_PAGE = 8;

  try {
    const count = await pool.query(
      `
      SELECT COUNT(*)
      FROM "Category"
      WHERE name ILIKE $1
    `,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of categories.");
  }
}

export async function updateCategory(
  id: string,
  prevState: CategoryActionState,
  formData: FormData
): Promise<CategoryActionState> {
  const validatedFields = CategoryFormSchema.safeParse({
    name: formData.get("name"),
    brand: formData.getAll("brand"),
    image: formData.get("image"),
    description: formData.get("description"),
    price: formData.get("price"),
  });

  if (!validatedFields.success) {
    console.log("Errors", validatedFields.error.flatten().fieldErrors);
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Car.",
    };
  }

  const { name, brand, image, description, price } = validatedFields.data;
  try {
    // Start a transaction for updating the category and associating the brands
    await pool.query("BEGIN");

    // Step 1: Update the Category
    const updateCategoryResult = await pool.query(
      `UPDATE "Category" 
       SET name = $1, price = $2, "imageUrl" = $3, description = $4
       WHERE id = $5
       RETURNING id`,
      [name, price, image, description, id]
    );

    // Check if category was updated
    if (updateCategoryResult.rows.length === 0) {
      throw new Error("Category not found");
    }

    const updatedCategoryId = updateCategoryResult.rows[0].id;

    // Step 2: Delete existing brands associated with the category (if any)
    await pool.query(`DELETE FROM "CategoryBrand" WHERE "categoryId" = $1`, [
      updatedCategoryId,
    ]);

    // Step 3: Insert new brands or update existing ones
    for (const b of brand) {
      // Check if the brand exists
      const brandResult = await pool.query(
        `SELECT id FROM "Brand" WHERE name = $1`,
        [b]
      );

      let brandId;

      if (brandResult.rows.length > 0) {
        // Brand exists, get the ID
        brandId = brandResult.rows[0].id;
      } else {
        // Brand does not exist, insert it
        const newBrandResult = await pool.query(
          `INSERT INTO "Brand" (name) 
           VALUES ($1) 
           RETURNING id`,
          [b]
        );
        brandId = newBrandResult.rows[0].id;
      }

      // Associate the brand with the category
      await pool.query(
        `INSERT INTO "CategoryBrand" ("categoryId", "brandId") 
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [updatedCategoryId, brandId]
      );
    }

    // Commit the transaction
    await pool.query("COMMIT");
  } catch (error) {
    // Rollback the transaction in case of error
    await pool.query("ROLLBACK");
    console.error("Error updating category:", error);
    return { state_error: "Error updating category" };
  }
  revalidatePath("/dashboard/categories");
  redirect("/dashboard/categories?success=true");
}

export async function deleteCategory(id: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Delete the associations between the category and brands
    await client.query(`DELETE FROM "CategoryBrand" WHERE "categoryId" = $1`, [
      id,
    ]);

    // Delete the category itself
    const result = await client.query(
      `DELETE FROM "Category" WHERE id = $1 RETURNING id`,
      [id]
    );

    if (result.rows.length > 0) {
      console.log(
        `Category with ID ${id} and related associations deleted successfully.`
      );
      await client.query("COMMIT");
      return true; // Return true if the category was deleted
    } else {
      console.log(`Category with ID ${id} not found.`);
      await client.query("ROLLBACK");
      return false; // Return false if no category with the given ID was found
    }
  } catch (error) {
    console.error("Error deleting category by ID:", error);
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function fetchFilteredTransactions(
  query: string,
  startDate: string,
  endDate: string,
  currentPage: number
): Promise<TransactionState[]> {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    let queryString = `
      SELECT 
        t.id, 
        t.reference, 
        t.amount, 
        t.status, 
        t."bookingId",
        t."createdAt"
      FROM "Transaction" t
      WHERE 
        (t.reference ILIKE $1 OR
        t."bookingId" ILIKE $1 OR
        CAST(t.amount AS TEXT) ILIKE $1)`;

    // If both startDate and endDate are provided, add date range filter
    const queryParams = [`%${query}%`];

    if (startDate && endDate) {
      queryString += ` AND t."createdAt" BETWEEN $2 AND $3`;
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      queryString += ` AND t."createdAt" >= $2`;
      queryParams.push(startDate);
    } else if (endDate) {
      queryString += ` AND t."createdAt" <= $2`;
      queryParams.push(endDate);
    }
    // Add pagination and order
    queryString += `
      ORDER BY t."createdAt" ASC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    // Add pagination params to queryParams array
    queryParams.push(ITEMS_PER_PAGE, offset);

    // Execute the query
    const result = await pool.query(queryString, queryParams);

    return result.rows;
  } catch (error) {
    console.error("Error fetching filtered transactions:", error);
    throw new Error("Failed to fetch transactions.");
  }
}

export async function fetchTransactionsPages(query: string) {
  const ITEMS_PER_PAGE = 8;

  try {
    const count = await pool.query(
      `
        SELECT COUNT(*)
        FROM "Transaction" t
        WHERE 
            t.reference ILIKE $1 OR
            CAST(t.amount AS TEXT) ILIKE $1
        `,
      [`%${query}%`]
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of transactions.");
  }
}

export async function getTransactionsById(
  bookingId: string
): Promise<TransactionState | null> {
  try {
    const result = await pool.query(
      `
      SELECT * FROM "Transaction"
      WHERE id = $1
    `,
      [bookingId]
    );

    // Check if a category was found
    if (result.rows.length > 0) {
      return result.rows[0]; // Return the single category object
    } else {
      console.log("No transaction found for id:", bookingId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching transaction by ID:", error);
    throw error; // Optionally rethrow the error for further handling
  }
}

export async function fetchFilteredBookings(
  query: string,
  startDate: string,
  endDate: string,
  currentPage: number,
  notification: string
): Promise<BookingState[]> {
  const ITEMS_PER_PAGE = 10;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    // Base SQL query with the date filtering conditions
    let queryString = `
      SELECT 
        b.id, 
        u.name AS "userName",
        u.phone,
        c.id AS "carId",
        c.name AS "carName",
        b."bookingDate",
        b.amount, 
        b.departure, 
        b."departureLatitude",
        b."departureLongitude",
        b.destination, 
        b."destinationLatitude",
        b."destinationLongitude",
        b."paymentStatus",
        b."bookingStatus",
        b."createdAt"
      FROM "Booking" b
      LEFT JOIN "User" u ON b."userId" = u.id
      LEFT JOIN "Car" c ON b."carId" = c.id
      WHERE 
        (b.viewed = $1 OR $1 = '') AND
        (u.name ILIKE $2 OR c.name ILIKE $2)`;

    // Array to store query parameters
    const queryParams = [notification, `%${query}%`];

    // Adding date filters if provided
    if (startDate && endDate) {
      queryString += ` AND b."bookingDate" BETWEEN $3 AND $4`;
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      queryString += ` AND b."bookingDate" >= $3`;
      queryParams.push(startDate);
    } else if (endDate) {
      queryString += ` AND b."bookingDate" <= $3`;
      queryParams.push(endDate);
    }

    // Pagination and ordering
    queryString += `
      ORDER BY b."createdAt" ASC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;

    // Add pagination params to queryParams
    queryParams.push(ITEMS_PER_PAGE, offset);

    // Execute the query
    const result = await pool.query(queryString, queryParams);

    return result.rows;
  } catch (error) {
    console.error("Error fetching filtered bookings:", error);
    throw new Error("Failed to fetch bookings.");
  }
}

export async function fetchBookingsPages(query: string) {
  const ITEMS_PER_PAGE = 8;

  try {
    const count = await pool.query(
      `
      SELECT COUNT(*)
      FROM "Booking"
   `
    );

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of bookings.");
  }
}

export async function getBookingById(
  bookingId: string
): Promise<BookingState | null> {
  try {
    const result = await pool.query(
      `
      SELECT 
        b.*,  -- Select all columns from Booking table
        u.name AS "userName",
        u.phone,
        c.id AS "carId",
        c.name AS "carName",
        ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'addonId', a.id,
            'addonName', a."addonName",
            'addonValue', a."addonValue"
          )
        ) AS "addons" -- Aggregate addons into an array of JSON objects
      FROM "Booking" b
      LEFT JOIN "User" u ON b."userId" = u.id
      LEFT JOIN "Car" c ON b."carId" = c.id
      LEFT JOIN "BookingAddon" ba ON b.id = ba."bookingId"
      LEFT JOIN "Addon" a ON ba."addonId" = a.id
      WHERE b.id = $1
      GROUP BY b.id, u.name, u.phone, c.id, c.name
      `,
      [bookingId]
    );

    // Check if a booking was found
    if (result.rows.length > 0) {
      const booking = result.rows[0];

      // Parse the "addons" field if needed
      booking.addons = booking.addons ? booking.addons : [];

      return booking; // Return the booking with addons
    } else {
      console.log("No booking found for id:", bookingId);
      return null;
    }
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw error; // Optionally rethrow the error for further handling
  }
}

const BookingFormSchema = z.object({
  userId: z.string().nullable().optional(),
  userName: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  carId: z.coerce.number().nullable().optional(),
  carName: z.string().nullable().optional(),
  bookingDate: z.string().nullable().optional(),
  amount: z.coerce.number().nullable().optional(),
  departure: z.string().nullable().optional(),
  destination: z.string().nullable().optional(),
  paymentStatus: z.string().nullable().optional(),
  bookType: z.string().nullable().optional(),
  paymentType: z.string().nullable().optional(),
  bookingStatus: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  departureLatitude: z.string().nullable().optional(),
  departureLongitude: z.string().nullable().optional(),
  destinationLatitude: z.string().nullable().optional(),
  destinationLongitude: z.string().nullable().optional(),
  viewed: z.string().nullable().optional(),
  addon: z
    .array(
      z.object({
        name: z.string().nullable().optional(),
        value: z.coerce.number().nullable().optional(),
      })
    )
    .nullable()
    .optional(),
});

export async function updateBooking(
  id: number,
  prevState: BookingActionState,
  formData: FormData
): Promise<BookingActionState> {
  const validatedFields = BookingFormSchema.safeParse({
    userId: formData.get("userId"),
    userName: formData.get("userName"),
    phone: formData.get("phone"),
    carId: formData.get("carId"),
    carName: formData.get("carName"),
    bookingDate: formData.get("bookingDate"),
    amount: formData.get("amount"),
    departure: formData.get("departure"),
    destination: formData.get("destination"),
    paymentStatus: formData.get("paymentStatus"),
    bookType: formData.get("bookType"),
    paymentType: formData.get("paymentType"),
    bookingStatus: formData.get("bookingStatus"),
    createdAt: formData.get("createdAt"),
    departureLatitude: formData.get("departureLatitude"),
    departureLongitude: formData.get("departureLongitude"),
    destinationLatitude: formData.get("destinationLatitude"),
    destinationLongitude: formData.get("destinationLongitude"),
    viewed: formData.get("viewed"),
    addon: formData.getAll("addon").map((addon, index) => ({
      name: addon,
      value: formData.getAll("value")[index],
    })),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to update Booking.",
    };
  }

  const { paymentStatus, bookType, paymentType, bookingStatus, viewed } =
    validatedFields.data;

  try {
    // Prepare the update query and values array
    let updateFields = [];
    let values = [id]; // Start the values array with the ID for where clause

    // Conditionally add the fields to be updated based on the available data
    if (paymentStatus) {
      updateFields.push(`"paymentStatus" = $${updateFields.length + 2}`);
      values.push(paymentStatus);
    }

    if (bookType) {
      updateFields.push(`"bookType" = $${updateFields.length + 2}`);
      values.push(bookType);
    }

    if (paymentType) {
      updateFields.push(`"paymentType" = $${updateFields.length + 2}`);
      values.push(paymentType);
    }

    if (bookingStatus) {
      updateFields.push(`"bookingStatus" = $${updateFields.length + 2}`);
      values.push(bookingStatus);
    }
    if (viewed) {
      updateFields.push(`"viewed" = $${updateFields.length + 2}`);
      values.push(viewed);
    }

    // Ensure at least one field is present to update
    if (updateFields.length === 0) {
      throw new Error("No valid fields to update.");
    }

    // Create the SET clause by joining the updated fields
    const setClause = updateFields.join(", ");

    // Update Booking details
    const result = await pool.query(
      `
      UPDATE "Booking"
      SET ${setClause}
      WHERE id = $1
      RETURNING id
    `,
      values
    );

    // Return result
    return { message: "Booking updated successfully" };
  } catch (error) {
    // Rollback the transaction in case of error
    console.error("Error updating :", error);
    return { state_error: "Error updating " };
  }
  redirect("/dashboard/cars?success=true");
}

export async function fetchCardData(startDate: string, endDate: string) {
  try {
    // Base query for counting bookings
    let baseQuery = `
      SELECT 
        COUNT(*) 
      FROM "Booking" 
      WHERE "bookingStatus" = $1
    `;
    const queryParams: string[] = ["CONFIRMED"];

    // Add date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      baseQuery += ` AND "createdAt" BETWEEN $2 AND $3`;
      queryParams.push(startDate, endDate); // Add the date parameters
    } else if (startDate) {
      baseQuery += ` AND "createdAt" >= $2`;
      queryParams.push(startDate); // Add the startDate parameter
    } else if (endDate) {
      baseQuery += ` AND "createdAt" <= $2`;
      queryParams.push(endDate); // Add the endDate parameter
    }

    // Count the confirmed bookings
    const paidBookingCountPromise = pool.query(baseQuery, queryParams);

    // Reset queryParams for cancelled bookings
    const cancelledQueryParams = ["CANCELLED"];
    let cancelledBookingCountPromise;

    // Modify base query for cancelled bookings with date filters
    if (startDate && endDate) {
      cancelledBookingCountPromise = pool.query(
        baseQuery.replace(
          '"bookingStatus" = $1',
          '"bookingStatus" = $1 AND "createdAt" BETWEEN $2 AND $3'
        ),
        ["CANCELLED", startDate, endDate]
      );
    } else if (startDate) {
      cancelledBookingCountPromise = pool.query(
        baseQuery.replace(
          '"bookingStatus" = $1',
          '"bookingStatus" = $1 AND "createdAt" >= $2'
        ),
        ["CANCELLED", startDate]
      );
    } else if (endDate) {
      cancelledBookingCountPromise = pool.query(
        baseQuery.replace(
          '"bookingStatus" = $1',
          '"bookingStatus" = $1 AND "createdAt" <= $2'
        ),
        ["CANCELLED", endDate]
      );
    } else {
      cancelledBookingCountPromise = pool.query(baseQuery, ["CANCELLED"]);
    }

    // Sum the transactions for confirmed and cancelled bookings
    let transactionsStatusQuery = `
      SELECT
        SUM(CASE WHEN "bookingStatus" = 'CONFIRMED' THEN amount ELSE 0 END) AS "paid",
        SUM(CASE WHEN "bookingStatus" = 'CANCELLED' THEN amount ELSE 0 END) AS "cancelled"
      FROM "Booking"
    `;
    const transactionsQueryParams: string[] = [];

    if (startDate && endDate) {
      transactionsQueryParams.push(startDate, endDate);
      transactionsStatusQuery += ` WHERE "createdAt" BETWEEN $1 AND $2`;
    } else if (startDate) {
      transactionsQueryParams.push(startDate);
      transactionsStatusQuery += ` WHERE "createdAt" >= $1`;
    } else if (endDate) {
      transactionsQueryParams.push(endDate);
      transactionsStatusQuery += ` WHERE "createdAt" <= $1`;
    }

    const transactionsStatusPromise = pool.query(
      transactionsStatusQuery,
      transactionsQueryParams
    );

    // Wait for all queries to finish
    const data = await Promise.all([
      paidBookingCountPromise,
      cancelledBookingCountPromise,
      transactionsStatusPromise,
    ]);

    // Extract the results from the database queries
    const numberOfPaidBooking = Number(data[0].rows[0].count ?? "0");
    const numberOfCancelledBooking = Number(data[1].rows[0].count ?? "0");
    const totalPaidBookings = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalCancelledBookings = formatCurrency(
      data[2].rows[0].cancelled ?? "0"
    );

    // Return the aggregated results
    return {
      numberOfPaidBooking,
      numberOfCancelledBooking,
      totalPaidBookings,
      totalCancelledBookings,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

export async function fetchLatestBookings(
  startDate: string,
  endDate: string
): Promise<BookingData[]> {
  try {
    let queryString = `
      SELECT 
        b.id,
        u.name AS "userName",
        u.email,
        u.phone,
        c.name AS "carName",
        c."imageUrl",
        c."categoryId",
        cat.name AS "categoryName",
        b.amount 
      FROM "Booking" b
      LEFT JOIN "User" u ON b."userId" = u.id
      LEFT JOIN "Car" c ON b."carId" = c.id
      LEFT JOIN "Category" cat ON c."categoryId" = cat.id
    `;

    const queryParams: string[] = [];

    // Add date filtering if startDate and endDate are provided
    if (startDate && endDate) {
      queryString += ` WHERE b."createdAt" BETWEEN $1 AND $2`;
      queryParams.push(startDate, endDate);
    } else if (startDate) {
      queryString += ` WHERE b."createdAt" >= $1`;
      queryParams.push(startDate);
    } else if (endDate) {
      queryString += ` WHERE b."createdAt" <= $1`;
      queryParams.push(endDate);
    }

    // Limit the results to the latest 5 bookings
    queryString += ` ORDER BY b."createdAt" DESC LIMIT 5`;

    // Execute the query with the constructed queryString and queryParams
    const result = await pool.query(queryString, queryParams);

    return result.rows;
  } catch (error) {
    console.error("Error fetching latest bookings:", error);
    throw new Error("Failed to fetch bookings.");
  }
}
