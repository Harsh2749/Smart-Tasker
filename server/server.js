import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import { startReminderCron } from "./cron.js";  // Cron Import
import "./passportConfig.js";                  // GoogleStrategy setup

// ───── Config ─────
dotenv.config();
const app       = express();
const PORT      = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV  = process.env.NODE_ENV || "development";

// ───── Middleware ─────
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  })
);
app.use(passport.initialize());               // Passport

// ───── Routes ─────
app.use("/api/auth", authRoutes);      // Authentication routes
app.use("/api/tasks", taskRoutes);     // Task CRUD routes

// ───── Health Check ─────
app.get("/", (req, res) => {
  res.send("SmartTasker API is running");
});

// ───── Global Error Handler ─────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// ───── MongoDB + Server Boot + Cron ─────
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Connected to MongoDB (${NODE_ENV} mode)`);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });

    // Start Cron Job After DB Connect
    startReminderCron();
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
