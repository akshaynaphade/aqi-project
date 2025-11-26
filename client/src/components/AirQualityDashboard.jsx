import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaHistory, FaDownload, FaBell, FaSearch, FaLeaf } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AirQualityDashboard = () => {
  const [citySearch, setCitySearch] = useState('Pune');
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock historical data 
  const mockHistory = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'AQI Trend (24h)',
      data: [65, 70, 80, 75, 68, 72],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.3
    }]
  };

  const fetchAirQualityData = async (city) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/aqi/${city}`);
      setAirQualityData(response.data.data);
    } catch (err) {
      console.error(err);
      setError('Could not find city data. Please check the spelling or try a major city.');
      setAirQualityData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAirQualityData('Pune');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (citySearch.trim()) {
      fetchAirQualityData(citySearch);
    }
  };

  // FEATURES

  // 1. Export Data to CSV
  const handleExport = () => {
    if (!airQualityData) return;
    
    // Create CSV header and row
    const headers = "City,AQI,Last Updated,PM2.5,PM10,O3,NO2,SO2,CO";
    const row = `${airQualityData.city},${airQualityData.aqi},${airQualityData.time},` +
                `${airQualityData.pollutants.pm25},${airQualityData.pollutants.pm10},` +
                `${airQualityData.pollutants.o3},${airQualityData.pollutants.no2},` +
                `${airQualityData.pollutants.so2},${airQualityData.pollutants.co}`;

    const csvContent = "data:text/csv;charset=utf-8," + headers + "\n" + row;
    
    // Trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${airQualityData.city}_aqi_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 2. Set Alert Mock
  const handleSetAlert = () => {
    if (!airQualityData) return;
    alert(`✅ Alert Set!\n\nYou will be notified if the AQI in ${airQualityData.city} rises above 150 (Unhealthy).`);
  };

  // 3. View History (Scroll to Chart)
  const handleViewHistory = () => {
    const chartElement = document.getElementById('aqi-chart-section');
    if (chartElement) {
        chartElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- NEW FEATURES END ---

  const getAQICategory = (aqi) => {
    if (aqi <= 50) return { label: 'Good', color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' };
    if (aqi <= 100) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    if (aqi <= 150) return { label: 'Sensitive', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' };
    if (aqi <= 200) return { label: 'Unhealthy', color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' };
    if (aqi <= 300) return { label: 'Very Unhealthy', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' };
    return { label: 'Hazardous', color: 'text-red-900', bg: 'bg-red-200', border: 'border-red-400' };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <FaLeaf className="text-green-500" /> Air Quality Index
                </h1>
                <p className="text-gray-500 text-sm mt-1">Real-time monitoring & forecast</p>
            </div>
            
            <form onSubmit={handleSearch} className="relative w-full md:w-96 shadow-sm">
                <input 
                    type="text" 
                    placeholder="Search city (e.g. New York, Mumbai)" 
                    className="w-full p-4 pl-5 pr-12 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                    <FaSearch size={18} />
                </button>
            </form>
        </div>

        {loading && (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )}
        
        {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                <p className="text-red-700 font-medium">{error}</p>
            </div>
        )}

        {airQualityData && !loading && (() => {
            const category = getAQICategory(airQualityData.aqi);
            
            return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in-up">
                
                {/* 1. Primary AQI Card */}
                <div className={`bg-white rounded-2xl shadow-sm p-6 border-2 ${category.border} relative overflow-hidden`}>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-gray-500 font-medium text-sm uppercase tracking-wider">Current AQI</h2>
                            <div className="flex items-baseline mt-2">
                                <span className={`text-6xl font-bold ${category.color}`}>{airQualityData.aqi}</span>
                                <span className="ml-2 text-gray-400 text-sm">US AQI</span>
                            </div>
                        </div>
                        <div className={`p-3 rounded-xl ${category.bg}`}>
                            <FaMapMarkerAlt className={`${category.color} text-xl`} />
                        </div>
                    </div>
                    
                    <div className="mb-6">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold ${category.bg} ${category.color}`}>
                            {category.label}
                        </span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4">
                        <p className="text-gray-800 font-semibold text-lg">{airQualityData.city}</p>
                        <p className="text-gray-400 text-xs mt-1">Updated: {airQualityData.time}</p>
                    </div>
                </div>

                {/* 2. Detailed Pollutants */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
                    <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        Pollutant Concentration <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-1 rounded">µg/m³</span>
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {Object.entries(airQualityData.pollutants).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 p-4 rounded-xl hover:bg-blue-50 transition-colors group">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-1">{key}</p>
                                <p className="text-2xl font-semibold text-gray-700 group-hover:text-blue-600">{value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Trend Chart (ID added for scroll) */}
                <div id="aqi-chart-section" className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800">Forecast Trend</h2>
                        <select className="bg-gray-50 border-none text-sm text-gray-500 rounded-lg p-2 cursor-pointer hover:bg-gray-100">
                            <option>Last 24 Hours</option>
                            <option>Last 7 Days</option>
                        </select>
                    </div>
                    <div className="h-64 w-full">
                        <Line 
                            data={mockHistory} 
                            options={{ 
                                maintainAspectRatio: false, 
                                responsive: true,
                                plugins: { legend: { display: false } },
                                scales: {
                                    y: { grid: { color: '#f3f4f6' }, beginAtZero: true },
                                    x: { grid: { display: false } }
                                }
                            }} 
                        />
                    </div>
                </div>

                {/* 4. Quick Actions Panel (NOW FUNCTIONAL) */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            {/* History Button: Scrolls to Chart */}
                            <button 
                                onClick={handleViewHistory}
                                className="w-full flex items-center p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all font-medium text-sm group"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-gray-400 group-hover:text-blue-500"><FaHistory /></div>
                                View Trend Graph
                            </button>
                            
                            {/* Export Button: Downloads CSV */}
                            <button 
                                onClick={handleExport}
                                className="w-full flex items-center p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-green-50 hover:text-green-600 transition-all font-medium text-sm group"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-gray-400 group-hover:text-green-500"><FaDownload /></div>
                                Export Data (CSV)
                            </button>
                            
                            {/* Alert Button: Shows Browser Alert */}
                            <button 
                                onClick={handleSetAlert}
                                className="w-full flex items-center p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition-all font-medium text-sm group"
                            >
                                <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-gray-400 group-hover:text-yellow-500"><FaBell /></div>
                                Set Alert
                            </button>
                        </div>
                    </div>
                </div>

                {/* 5. Health Recommendations */}
                <div className="lg:col-span-3 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">Health Recommendations</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <ul className="space-y-3">
                            <li className="flex items-start opacity-90"><span className="mr-3 bg-white bg-opacity-20 rounded-full p-1 text-xs">✓</span>Wear a mask if AQI exceeds 150.</li>
                            <li className="flex items-start opacity-90"><span className="mr-3 bg-white bg-opacity-20 rounded-full p-1 text-xs">✓</span>Use air purifiers indoors.</li>
                        </ul>
                        <ul className="space-y-3">
                            <li className="flex items-start opacity-90"><span className="mr-3 bg-white bg-opacity-20 rounded-full p-1 text-xs">✓</span>Avoid outdoor exercise during peak hours.</li>
                            <li className="flex items-start opacity-90"><span className="mr-3 bg-white bg-opacity-20 rounded-full p-1 text-xs">✓</span>Keep windows closed to reduce exposure.</li>
                        </ul>
                    </div>
                </div>

            </div>
            );
        })()}
      </div>
    </div>
  );
};

export default AirQualityDashboard;