import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "travelora-secret-change-me";

// Auth middleware: must be a valid admin token
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.is_admin) {
      return res
        .status(403)
        .json({ message: "Admin access required" });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Stats overview
router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const [bookings, contacts, users] = await Promise.all([
      pool.query("SELECT COUNT(*)::int AS count FROM bookings"),
      pool.query("SELECT COUNT(*)::int AS count FROM contact_messages"),
      pool.query("SELECT COUNT(*)::int AS count FROM travelora_users"),
    ]);
    res.json({
      bookings: bookings.rows[0].count,
      messages: contacts.rows[0].count,
      users: users.rows[0].count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// List all bookings
router.get("/bookings", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookings ORDER BY created_at DESC"
    );
    res.json({ bookings: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a booking
router.delete("/bookings/:id", requireAdmin, async (req, res) => {
  try {
    await pool.query("DELETE FROM bookings WHERE id = $1", [req.params.id]);
    res.json({ message: "Booking deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// List contact messages
router.get("/contacts", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC"
    );
    res.json({ contacts: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// List registered users
router.get("/users", requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, is_admin, created_at FROM travelora_users ORDER BY created_at DESC"
    );
    res.json({ users: result.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;