// db.ts
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "bd8sfjw7wroanyva5ifl-mysql.services.clever-cloud.com",
  user: "udlynywxagph9onl",
  password: "2vtXpxs74VMA60839yj2",
  database: "bd8sfjw7wroanyva5ifl",
});
(async () => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT 1");
    connection.release();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
})();

export async function createUsersTable(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role ENUM('Admin', 'User')
      )
    `);
    connection.release();
    console.log("Users table created successfully!");
  } catch (error) {
    console.error("Error creating users table:", error);
  }
}

export async function createGroceryItemsTable(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS grocery_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE,
        price DECIMAL(10, 2),
        quantity INT
      )
    `);
    connection.release();
    console.log("Grocery items table created successfully!");
  } catch (error) {
    console.error("Error creating grocery items table:", error);
  }
}

export async function createOrdersTable(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    connection.release();
    console.log("Orders table created successfully!");
  } catch (error) {
    console.error("Error creating orders table:", error);
  }
}

export async function createOrderItemsTable(): Promise<void> {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        grocery_item_id INT,
        quantity INT,
        FOREIGN KEY (order_id) REFERENCES orders(id),
        FOREIGN KEY (grocery_item_id) REFERENCES grocery_items(id)
      )
    `);
    connection.release();
    console.log("Order items table created successfully!");
  } catch (error) {
    console.error("Error creating order items table:", error);
  }
}

// Call the functions to create the tables when the module is loaded
createOrdersTable();
createOrderItemsTable();
createUsersTable();
createGroceryItemsTable();
export default pool;
