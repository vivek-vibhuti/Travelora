import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "travelora-secret-change-me";

const SECURITY_QUESTIONS = [
  "What is the name of your first pet?",
  "What was your childhood nickname?",
  "What is your mother's maiden name?",
  "What was the name of your first school?",
  "What city were you born in?",
];

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, security_question, security_answer } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    if (!security_question || !security_answer) {
      return res
        .status(400)
        .json({ message: "Please choose a security question and answer" });
    }
    if (!SECURITY_QUESTIONS.includes(security_question)) {
      return res
        .status(400)
        .json({ message: "Invalid security question" });
    }

    const existingUser = await pool.query(
      "SELECT id FROM travelora_users WHERE email = $1",
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(
      security_answer.trim().toLowerCase(),
      10
    );

    const result = await pool.query(
      `INSERT INTO travelora_users
         (name, email, password, security_question, security_answer)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, is_admin, created_at`,
      [name, email, hashedPassword, security_question, hashedAnswer]
    );

    const user = result.rows[0];
    res.status(201).json({
      message: "User registered successfully",
      token: signToken(user),
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const result = await pool.query(
      "SELECT * FROM travelora_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Also allow admin login through the main login
    res.json({
      message: "Login successful",
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot password step 1: request security question
router.post("/forgot", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const result = await pool.query(
      "SELECT security_question FROM travelora_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const question = result.rows[0].security_question;
    if (!question) {
      return res
        .status(400)
        .json({ message: "This account has no security question set" });
    }

    res.json({ message: "Security question found", question });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Forgot password step 2: verify answer + reset
router.post("/reset", async (req, res) => {
  try {
    const { email, security_answer, new_password } = req.body;

    if (!email || !security_answer || !new_password) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }
    if (new_password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const result = await pool.query(
      "SELECT * FROM travelora_users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No account found with that email" });
    }

    const user = result.rows[0];
    if (!user.security_answer) {
      return res
        .status(400)
        .json({ message: "This account has no security question set" });
    }

    const answerMatches = await bcrypt.compare(
      security_answer.trim().toLowerCase(),
      user.security_answer
    );

    if (!answerMatches) {
      return res.status(401).json({ message: "Security answer is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await pool.query(
      "UPDATE travelora_users SET password = $1 WHERE id = $2",
      [hashedPassword, user.id]
    );

    res.json({ message: "Password reset successfully. You can now log in." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;