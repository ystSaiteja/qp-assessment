// routes/authRoutes.ts
import express from "express";
import { User } from "../models/User";
import pool from "../db";
import { hashPassword, comparePasswords, generateToken } from "../auth";
import { adminMiddleware } from "../middleware/adminMiddleware";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const user: User = req.body;
    const hashedPassword = await hashPassword(user.password);
    const [result]: any = await pool.query("INSERT INTO users SET ?", {
      ...user,
      password: hashedPassword,
    });
    const token = generateToken({
      id: result.insertId,
      username: user.username,
      role: user.role,
    });
    res.json({
      status: true,
      message: "Registeration successful",
      data: user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const user: User = rows[0];
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
    });
    res.json({ status: true, message: "Login successfull", token: token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add new grocery item
router.post("/grocery-items", adminMiddleware, async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const [result] = await pool.query(
      "INSERT INTO grocery_items (name, price, quantity) VALUES (?, ?, ?)",
      [name, price, quantity]
    );
    res.json({ id: result });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// View existing grocery items
router.get("/grocery-items", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM grocery_items");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Remove grocery item
router.delete("/grocery-items/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM grocery_items WHERE id = ?", [id]);
    res.json({ message: "Grocery item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update grocery item details
router.put("/grocery-items/:id", adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, quantity } = req.body;
    await pool.query(
      "UPDATE grocery_items SET name = ?, price = ?, quantity = ? WHERE id = ?",
      [name, price, quantity, id]
    );
    res.json({ message: "Grocery item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
