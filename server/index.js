/**
 * LinguaSync — Express API Server
 * Main entry point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '*').split(',').map(s => s.trim());
app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  methods: ['GET', 'POST'],
  credentials: true,
}));

// --- Static Files ---
// Serve the website from /website directory
app.use(express.static(path.join(__dirname, '..', 'website')));

// Serve the dashboard from /public/dashboard
app.use('/dashboard', express.static(path.join(__dirname, '..', 'public', 'dashboard')));

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Fallback: serve index.html for SPA-like behavior ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'website', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'dashboard', 'index.html'));
});

// --- Error Handler ---
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// --- Start ---
app.listen(PORT, () => {
  console.log('');
  console.log('  🌐 LinguaSync API Server');
  console.log('  ========================');
  console.log(`  🚀 Server:     http://localhost:${PORT}`);
  console.log(`  📄 Website:    http://localhost:${PORT}/`);
  console.log(`  📊 Dashboard:  http://localhost:${PORT}/dashboard`);
  console.log(`  🔌 API:        http://localhost:${PORT}/api/health`);
  console.log(`  🌍 ENV:        ${process.env.NODE_ENV || 'development'}`);
  console.log('');
});

module.exports = app;
