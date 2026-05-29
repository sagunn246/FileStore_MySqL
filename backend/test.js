import pool from "./config/db.js";

try {
  const conn = await pool.getConnection();
  console.log("MySQL Connected!");
  conn.release();
} catch (err) {
  console.error("Full error:", err);
}