const NodeCache = require('node-cache');

// TTL (Time To Live): 3600 seconds = 1 hour
// Checkperiod: 600 seconds = 10 minutes (cleans up expired keys)
const cache = new NodeCache({ stdTTL: 3600, checkperiod: 600 });

module.exports = cache;