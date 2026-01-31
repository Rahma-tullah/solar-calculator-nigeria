const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Test database connection
const db = require("./config/database");

db.query("SELECT 1")
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Database connection failed:", err.message);
  });

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic test route
app.get("/", (req, res) => {
  res.json({ message: "Solar Calculator API is running!" });
});

// Import routes (we'll create these next)
const calculationsRoutes = require("./routes/route_calculations");
const installersRoutes = require("./routes/route_installers");
const chatRoutes = require("./routes/route_chatbot");
const emailRoutes = require("./routes/route_emails");
const authRoutes = require("./routes/route_auth");
const leadRoutes = require("./routes/route_leads");
// Use routes
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/calculations", emailRoutes);
app.use("/api/calculations", calculationsRoutes);
app.use("/api/installers", installersRoutes);
app.use("/api/chat", chatRoutes);

// Serve static frontend files
const path = require("path");
app.use(express.static(path.join(__dirname, "frontend")));

// Catch all other routes and send index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
