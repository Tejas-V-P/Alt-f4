require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const prepRoutes = require('./routes/prepRoutes');
const offerRoutes = require('./routes/offerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/prep', prepRoutes);
app.use('/api/offers', offerRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Centralized 404
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Placement Preparation Portal Backend server listening on port ${PORT}`);
});
