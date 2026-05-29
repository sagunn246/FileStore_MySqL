import express from "express";
import upload from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";
import pool from "../config/db.js";

const router = express.Router();

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    console.log("File received:", req.file);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const { originalname, path, size, mimetype, filename } = req.file;
    const folder_id = req.body.folder_id || null;

    const [result] = await pool.query(
      "INSERT INTO files (name, url, public_id, size, type, folder_id) VALUES (?, ?, ?, ?, ?, ?)",
      [originalname, path, filename, size, mimetype, folder_id]
    );
    res.status(201).json({
      id: result.insertId,
      name: originalname,
      url: path,
      public_id: filename,
      size,
      type: mimetype,
      folder_id,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all files
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM files ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Get files error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Delete a file
router.delete("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM files WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "File not found" });

    const file = rows[0];
    await cloudinary.uploader.destroy(file.public_id, { resource_type: "auto" });
    await pool.query("DELETE FROM files WHERE id = ?", [req.params.id]);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;