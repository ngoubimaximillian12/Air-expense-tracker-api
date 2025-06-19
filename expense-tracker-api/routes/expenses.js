const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all expenses
router.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM expenses ORDER BY date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err.message);
    res.status(500).send("Server error");
  }
});

// POST a new expense
router.post("/", async (req, res) => {
  const { title, amount, date } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO expenses (title, amount, date) VALUES ($1, $2, $3) RETURNING *",
      [title, amount, date || new Date()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Error adding expense:", err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
