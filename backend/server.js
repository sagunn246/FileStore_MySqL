import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileRoutes from "./routes/fileRoutes.js";
import pool from "./config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/files/", fileRoutes);

// Test DB connection on startup
pool.getConnection()
  .then(() => console.log("MySQL Connected"))
  .catch((err) => console.error("MySQL Error:", err.message));

const PORT = process.env.PORT || 5000;
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({ error: err.message });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));