const express = require('express');
const router = express.Router();
const chartRoutes = require('./chartRoutes');
const { initializeProject } = require('../controllers/initController');

// Health check
router.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Initialize project
router.get('/init', initializeProject);

// API routes
router.use('/charts', chartRoutes);

module.exports = router;

