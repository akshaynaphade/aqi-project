require('dotenv').config();
const express = require('express');
const cors = require('cors');
const aqiRoutes = require('./routes/aqiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend communication
app.use(express.json());

// Mount Routes
app.use('/api/aqi', aqiRoutes);

// Health check route
app.get('/', (req, res) => {
    res.send('AQI Server is running');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running locally on port ${PORT}`);
});