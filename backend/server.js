const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const requestLogger = require("./middleware/requestLogger");
const diamondRoutes = require("./routes/diamonds");

const app = express();
const PORT = process.env.PORT || 4000;

// ── Security & parsing ───────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET"],
}));
app.use(express.json());
app.use(requestLogger);

// ── Routes ───────────────────────────────────────────────────────────────────
app.use("/api", diamondRoutes);

// Health check
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// 404 fallback
app.use((_req, res) => res.status(404).json({ success: false, message: "Not found" }));

// ── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n💎 Diamond API running on http://localhost:${PORT}\n`);
});

module.exports = app;
