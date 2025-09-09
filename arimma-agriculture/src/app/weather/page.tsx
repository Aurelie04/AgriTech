'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface WeatherData {
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    visibility: number;
    uv_index: number;
  };
  daily: Array<{
    dt: number;
    temp: { min: number; max: number };
    humidity: number;
    pressure: number;
    wind_speed: number;
    wind_deg: number;
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    pop: number;
  }>;
}

interface Location {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export default function WeatherPage() {
  const { user } = useAuth();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your current location. Please search for a city instead.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Fetch weather data
  const fetchWeather = async (lat?: number, lon?: number, city?: string) => {
    try {
      setLoading(true);
      setError(null);

      let url = '/api/weather?';
      if (lat && lon) {
        url += `lat=${lat}&lon=${lon}`;
      } else if (city) {
        url += `city=${encodeURIComponent(city)}`;
      } else {
        throw new Error('No location provided');
      }

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setWeatherData(result.data);
        setLocation(result.location);
      } else {
        setError(result.error || 'Failed to fetch weather data');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(undefined, undefined, searchQuery.trim());
    }
  };

  // Handle current location
  const handleCurrentLocation = () => {
    getCurrentLocation();
  };

  // Format date
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-ZA', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get weather icon URL
  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  // Get wind direction
  const getWindDirection = (degrees: number) => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  };

  // Get UV index description
  const getUVDescription = (index: number) => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <button
              onClick={() => window.history.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              title="Go Back"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Weather Forecast</h1>
              <p className="text-gray-600">Get 7-day weather predictions for your location</p>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              title="Go to Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for a city (e.g., Johannesburg, Cape Town, Durban)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !searchQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
            <button
              onClick={handleCurrentLocation}
              disabled={loading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <span>📍</span>
              Use My Location
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-red-500">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Current Weather */}
        {weatherData && location && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Current Weather</h2>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-700">{location.name}</p>
                <p className="text-sm text-gray-500">{location.country}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Weather Info */}
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={getWeatherIcon(weatherData.current.weather[0].icon)}
                    alt={weatherData.current.weather[0].description}
                    className="w-20 h-20"
                  />
                </div>
                <div className="text-6xl font-bold text-gray-800 mb-2">
                  {weatherData.current.temp}°C
                </div>
                <div className="text-xl text-gray-600 capitalize">
                  {weatherData.current.weather[0].description}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Feels like {weatherData.current.feels_like}°C
                </div>
              </div>

              {/* Weather Details */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Humidity</span>
                  <span className="font-semibold">{weatherData.current.humidity}%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Pressure</span>
                  <span className="font-semibold">{weatherData.current.pressure} hPa</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Visibility</span>
                  <span className="font-semibold">{(weatherData.current.visibility / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">UV Index</span>
                  <span className="font-semibold">
                    {weatherData.current.uv_index} ({getUVDescription(weatherData.current.uv_index)})
                  </span>
                </div>
              </div>

              {/* Wind Info */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Wind Speed</span>
                  <span className="font-semibold">{weatherData.current.wind_speed} m/s</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Wind Direction</span>
                  <span className="font-semibold">
                    {getWindDirection(weatherData.current.wind_deg)} ({weatherData.current.wind_deg}°)
                  </span>
                </div>
                <div className="text-center mt-4">
                  <div className="text-sm text-gray-500 mb-2">Wind Direction</div>
                  <div className="w-16 h-16 mx-auto relative">
                    <div
                      className="absolute inset-0 border-2 border-gray-300 rounded-full"
                      style={{
                        transform: `rotate(${weatherData.current.wind_deg}deg)`
                      }}
                    >
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-blue-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7-Day Forecast */}
        {weatherData && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">7-Day Forecast</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
              {weatherData.daily.map((day, index) => (
                <div
                  key={day.dt}
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-sm font-semibold text-gray-600 mb-2">
                    {index === 0 ? 'Today' : formatDate(day.dt)}
                  </div>
                  
                  <div className="flex justify-center mb-3">
                    <img
                      src={getWeatherIcon(day.weather[0].icon)}
                      alt={day.weather[0].description}
                      className="w-12 h-12"
                    />
                  </div>
                  
                  <div className="text-lg font-bold text-gray-800 mb-1">
                    {day.temp.max}°C
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {day.temp.min}°C
                  </div>
                  
                  <div className="text-xs text-gray-500 capitalize mb-2">
                    {day.weather[0].description}
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between">
                      <span>💧</span>
                      <span>{day.humidity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>💨</span>
                      <span>{day.wind_speed} m/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🌧️</span>
                      <span>{Math.round(day.pop * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </div>
        )}

        {/* No Data State */}
        {!weatherData && !loading && !error && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🌤️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Search for Weather</h3>
            <p className="text-gray-500">Enter a city name or use your current location to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
