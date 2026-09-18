import bcrypt from "bcryptjs";
import pool from "./db.js";

const ADMIN_EMAIL = "root@usergmail.com";
const ADMIN_PASSWORD = "root123";

// Dedicated Travelora users table (the shared DB's `users` table belongs to another app).
try {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS travelora_users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      security_question VARCHAR(255),
      security_answer VARCHAR(255),
      is_admin BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
  console.log("travelora_users table ready");

  // Seed admin
  const existing = await pool.query(
    "SELECT id FROM travelora_users WHERE email = $1",
    [ADMIN_EMAIL]
  );
  if (existing.rows.length === 0) {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      `INSERT INTO travelora_users (name, email, password, is_admin)
       VALUES ($1, $2, $3, TRUE)`,
      ["Administrator", ADMIN_EMAIL, hash]
    );
    console.log("Admin seeded:", ADMIN_EMAIL, "(from root123)");
  } else {
    console.log("Admin already exists, skipping seed");
  }
} catch (e) {
  console.error("MIGRATE ERROR:", e.message);
  process.exit(1);
} finally {
  await pool.end();
}