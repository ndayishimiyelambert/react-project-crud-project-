import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud_db"
});

db.connect(err => {
  if (err) console.log("❌ MySQL connection error:", err);
  else console.log("✅ Connected to MySQL Database: crud");
});

/*
-- Run these SQL commands in MySQL:
CREATE DATABASE crud_db;
USE crud_db;
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50)
);
*/

// ✅ CREATE
app.post("/users", (req, res) => {
  const { name, email, phone } = req.body;
  const sql = "INSERT INTO users (name, email, phone) VALUES (?, ?, ?)";
  db.query(sql, [name, email, phone], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User added successfully", id: result.insertId });
  });
});

// ✅ READ (All)
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// ✅ READ (One)
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  });
});

// ✅ UPDATE
app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;
  const sql = "UPDATE users SET name = ?, email = ?, phone = ? WHERE id = ?";
  db.query(sql, [name, email, phone, id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User updated successfully" });
  });
});

// ✅ DELETE
app.delete("/users/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM users WHERE id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User deleted successfully" });
  });
});

// ✅ Start server
app.listen(4000, () => console.log("🚀 Server running on port 4000"));
