import React, { useState, useEffect } from "react";

const WeatherForecast = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [query, setQuery] = useState('');

  const apiKey = "4eaccaeb1526729b96977a4c73e78305";

  const fetchWeatherByCoords = (lat, lon) => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        setWeatherData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather:", err);
        setLoading(false);
      });
  };

  const fetchWeatherByCity = (city) => {
    setLoading(true);
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cod === 200) {
          setWeatherData(data);
        } else {
          alert("City not found. Please try again.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("City fetch error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        fetchWeatherByCoords(latitude, longitude);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLoading(false);
      }
    );
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeatherByCity(query.trim());
      setQuery('');
    }
  };

  return (
    <div className="p-4 bg-blue-100 rounded-xl shadow w-full max-w-sm">
      <h2 className="text-xl font-bold mb-3 text-center">🌤️ Weather Forecast</h2>

      <form onSubmit={handleSearch} className="mb-3 flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter location"
          className="flex-grow px-3 py-1 rounded-l border border-gray-300"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1 rounded-r hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {loading ? (
        <div>Loading weather...</div>
      ) : weatherData ? (
        <div>
          <p><strong>Location:</strong> {weatherData.name}</p>
          <p><strong>Temperature:</strong> {weatherData.main.temp}°C</p>
          <p><strong>Humidity:</strong> {weatherData.main.humidity}%</p>
          <p><strong>Condition:</strong> {weatherData.weather[0].description}</p>
        </div>
      ) : (
        <div>Failed to load weather data.</div>
      )}
    </div>
  );
};

export default WeatherForecast;
