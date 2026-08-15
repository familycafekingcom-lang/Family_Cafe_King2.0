const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const leadroutes = require("./routes/leadroutes");
const bookingroutes = require("./routes/bookingroutes");
const contactroutes = require("./routes/contactroutes");
const adminroutes = require("./routes/adminroutes");
const launchroutes = require("./routes/launchroutes");
const sliderroutes = require("./routes/sliderroutes");
const trainingroutes = require("./routes/trainingroutes");

const app = express();

// Middlewares - Allow CORS from any origin or dev server
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static frontend build assets if dist directory exists
const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Family Cafe King MERN Backend Active 🚀",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/leads", leadroutes);
app.use("/api/bookings", bookingroutes);
app.use("/api/contacts", contactroutes);
app.use("/api/admin", adminroutes);
app.use("/api/launches", launchroutes);
app.use("/api/slides", sliderroutes);
app.use("/api/training", trainingroutes);

// 404 handler for unmatched API routes
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// Serve index.html for non-API client routes (Express 5 safe fallback)
app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) {
      res.json({
        success: true,
        message: "Family Cafe King Backend Running 🚀",
      });
    }
  });
});

module.exports = app;