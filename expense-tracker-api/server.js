const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// DB test route
app.get("/users", async (req, res) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ server_time: result.rows[0] });
  } catch (err) {
    console.error("❌ DB query error:", err.message);
    res.status(500).send("DB error");
  }
});

// 🔐 Auth routes
app.use("/api/auth", authRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});
