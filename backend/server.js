/**
 * FEAST Backend Server
 * Main entry point for the Node.js + Express API
 * Handles all vendor, price, surplus, and emergency supply tracking
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import route handlers
const vendorRoutes = require('./routes/vendors');
const priceRoutes = require('./routes/prices');
const surplusRoutes = require('./routes/surplus');
const emergencyRoutes = require('./routes/emergency');
const aiRoutes = require('./routes/ai');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware Configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' })); // Support larger JSON payloads for image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'FEAST Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/vendors', vendorRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/surplus', surplusRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/ai', aiRoutes);

// File upload endpoint (general purpose)
app.post('/api/upload', require('./utils/upload'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested endpoint ${req.originalUrl} does not exist`
  });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 FEAST Backend Server Started');
  console.log(`📡 Server running on http://localhost:${PORT}`);
  console.log(`🌐 API base URL: http://localhost:${PORT}/api`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  process.exit(0);
});
