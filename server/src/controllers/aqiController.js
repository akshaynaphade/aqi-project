const { fetchAQIFromVendor } = require('../services/weatherService');
const cache = require('../utils/cache');

const getCityAQI = async (req, res) => {
    // Normalize city name to lowercase for consistent cache keys
    const city = req.params.city.toLowerCase();

    // 1. Check Cache
    const cachedData = cache.get(city);
    if (cachedData) {
        console.log(`Serving ${city} from cache`);
        return res.status(200).json({
            source: 'cache',
            data: cachedData
        });
    }

    // 2. If not in cache, fetch from Vendor
    try {
        const vendorResponse = await fetchAQIFromVendor(city);

        // API specific error handling
        if (vendorResponse.status !== 'ok') {
            return res.status(404).json({ error: 'City not found or API error' });
        }

        const data = vendorResponse.data;

        // Structure the data for the frontend
        const cleanData = {
            city: data.city.name,
            aqi: data.aqi,
            pollutants: {
                pm25: data.iaqi.pm25?.v || 0,
                pm10: data.iaqi.pm10?.v || 0,
                o3: data.iaqi.o3?.v || 0,
                no2: data.iaqi.no2?.v || 0,
                so2: data.iaqi.so2?.v || 0,
                co: data.iaqi.co?.v || 0,
            },
            location: data.city.geo,
            time: data.time.s
        };

        // 3. Save to Cache
        cache.set(city, cleanData);

        return res.status(200).json({
            source: 'api',
            data: cleanData
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getCityAQI };