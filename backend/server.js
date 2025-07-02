const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db"); // MongoDB connection logic
const userRoutes = require("./routes/userRoutes"); // Optional, if user system exists
const childRoutes = require("./routes/childRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS Configuration
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000"], // frontend dev URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Middleware
app.use(express.json());

// ✅ API Routes
app.use("/api/users", userRoutes); // if you have user routes
app.use("/api/children", childRoutes);

// ✅ Sample Endpoint (Optional)
app.get("/get-child-location", (req, res) => {
  res.json({
    latitude: 22.5726 + (Math.random() * 0.01 - 0.005), // Simulated GPS
    longitude: 88.3639 + (Math.random() * 0.01 - 0.005),
  });
});

// ✅ Root Endpoint
app.get("/", (req, res) => {
  res.send("Welcome to Child Safety Tracking API!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
