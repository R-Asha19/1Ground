// server.js — Main entry point for Nestora Backend

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB, then seed admin
connectDB().then(() => seedAdmin());

const app = express();

// ── Allowed Frontend Origins ─────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'https://1ground.vercel.app',
  'https://1ground.co.in',
  'https://www.1ground.co.in',
];

// ── Middleware ───────────────────────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, server-to-server, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data

// ── API Routes ───────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/properties', require('./routes/propertyRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// ── Health check ─────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '🏠 Nestora API is running!',
    version: '1.0.0',
  });
});

// ── 404 handler ──────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ── Global error handler ─────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// ── Start server ─────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});