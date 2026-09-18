import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO contact_messages (name, email, subject, message)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [name, email, subject, message]
    );

    res.status(201).json({
      message: "Message sent successfully",
      contact: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to send message",
    });
  }
});

export default router;