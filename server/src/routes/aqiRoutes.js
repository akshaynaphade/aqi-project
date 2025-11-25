const express = require('express');
const router = express.Router();
const { getCityAQI } = require('../controllers/aqiController');

// GET /api/aqi/:city
router.get('/:city', getCityAQI);

module.exports = router;