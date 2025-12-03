const express = require('express');
const router = express.Router();
const {
  getAllCharts,
  getChartById,
  calculateChart,
  updateChart,
  deleteChart,
  getChartsBySign,
  getStatistics
} = require('../controllers/chartController');
const { validateCalculateChart, validateUpdateChart } = require('../middleware/validators');

// Statistics route (before :id to avoid conflict)
router.get('/stats/summary', getStatistics);

// Get charts by sign
router.get('/sign/:sign', getChartsBySign);

// Get all charts
router.get('/', getAllCharts);

// Get single chart
router.get('/:id', getChartById);

// Calculate new chart
router.post('/calculate', validateCalculateChart, calculateChart);

// Update chart
router.put('/:id', validateUpdateChart, updateChart);

// Delete chart
router.delete('/:id', deleteChart);

module.exports = router;

