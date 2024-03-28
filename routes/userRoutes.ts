// routes/userRoutes.ts
import express from "express";
import pool from "../db";
import { ResultSetHeader } from "mysql2/promise";
import { userMiddleware } from "../middleware/userMiddleware";
const router = express.Router();

// View the list of available grocery items
router.get("/grocery-items", userMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM grocery_items WHERE quantity > 0"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a new order with multiple items
router.post("/orders", userMiddleware, async (req, res) => {
  try {
    const { userId, items } = req.body;

    // Create a new order
    const [orderResult] = await pool.query(
      "INSERT INTO orders (user_id) VALUES (?)",
      [userId]
    );
    // Accessing insertId property
    const orderId = (orderResult as ResultSetHeader).insertId;
    // Add each item to the order
    for (const item of items) {
      const { groceryItemId, quantity } = item;
      await pool.query(
        "INSERT INTO order_items (order_id, grocery_item_id, quantity) VALUES (?, ?, ?)",
        [orderId, groceryItemId, quantity]
      );
    }
    res.json({ orderId });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Get orders for a user
router.get("/orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ?",
      [userId]
    );
    res.json(orders);
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get items for an order
router.get("/orders/:orderId/items", async (req, res) => {
  try {
    const { orderId } = req.params;
    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [orderId]
    );
    res.json(items);
  } catch (error) {
    console.error("Error getting order items:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
