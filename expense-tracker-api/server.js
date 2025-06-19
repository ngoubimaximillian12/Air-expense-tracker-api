const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const db = require("./config/db");
const authRoutes = require("./routes/auth"); // ✅ Corrected file name
const expenseRoutes = require("./routes/expenses"); // ✅ Include expenses

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(helmet());
app.use(express.json());

// ✅ Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ✅ Health Check
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// ✅ Simple DB Test Route
app.get("/users", async (req, res, next) => {
  try {
    const result = await db.query("SELECT NOW()");
    res.json({ server_time: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
}

module.exports = app;

