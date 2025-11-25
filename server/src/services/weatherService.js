const axios = require('axios');

const BASE_URL = 'https://api.waqi.info/feed';
const API_TOKEN = process.env.AQI_API_TOKEN;

const fetchAQIFromVendor = async (city) => {
    try {
        // Using the recommended AQICN API
        const response = await axios.get(`${BASE_URL}/${city}/?token=${API_TOKEN}`);
        return response.data;
    } catch (error) {
        console.error("Vendor API Error:", error.message);
        throw new Error('Failed to fetch data from vendor');
    }
};

module.exports = { fetchAQIFromVendor };