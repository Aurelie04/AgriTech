import { NextRequest, NextResponse } from 'next/server';

// OpenWeatherMap API configuration
const API_KEY = process.env.OPENWEATHER_API_KEY || 'c760ad938ec96eb5c55866a3eb920265';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Mock weather data for demo purposes when API key is not available
const mockWeatherData = {
  current: {
    temp: 22,
    feels_like: 24,
    humidity: 65,
    pressure: 1013,
    wind_speed: 3.5,
    wind_deg: 180,
    weather: [
      {
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }
    ],
    visibility: 10000,
    uv_index: 6
  },
  daily: [
    {
      dt: Date.now() / 1000,
      temp: { min: 18, max: 25 },
      humidity: 65,
      pressure: 1013,
      wind_speed: 3.5,
      wind_deg: 180,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      pop: 0.1
    },
    {
      dt: (Date.now() / 1000) + 86400,
      temp: { min: 19, max: 26 },
      humidity: 70,
      pressure: 1012,
      wind_speed: 4.2,
      wind_deg: 200,
      weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
      pop: 0.2
    },
    {
      dt: (Date.now() / 1000) + 172800,
      temp: { min: 17, max: 24 },
      humidity: 75,
      pressure: 1010,
      wind_speed: 5.1,
      wind_deg: 220,
      weather: [{ main: 'Rain', description: 'light rain', icon: '10d' }],
      pop: 0.6
    },
    {
      dt: (Date.now() / 1000) + 259200,
      temp: { min: 16, max: 23 },
      humidity: 80,
      pressure: 1008,
      wind_speed: 4.8,
      wind_deg: 240,
      weather: [{ main: 'Rain', description: 'moderate rain', icon: '10d' }],
      pop: 0.8
    },
    {
      dt: (Date.now() / 1000) + 345600,
      temp: { min: 18, max: 25 },
      humidity: 70,
      pressure: 1011,
      wind_speed: 3.9,
      wind_deg: 190,
      weather: [{ main: 'Clouds', description: 'scattered clouds', icon: '03d' }],
      pop: 0.3
    },
    {
      dt: (Date.now() / 1000) + 432000,
      temp: { min: 20, max: 27 },
      humidity: 65,
      pressure: 1014,
      wind_speed: 3.2,
      wind_deg: 170,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      pop: 0.1
    },
    {
      dt: (Date.now() / 1000) + 518400,
      temp: { min: 21, max: 28 },
      humidity: 60,
      pressure: 1015,
      wind_speed: 2.8,
      wind_deg: 160,
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      pop: 0.05
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const city = searchParams.get('city');

    // If no location parameters provided, return error
    if (!lat && !lon && !city) {
      return NextResponse.json(
        { error: 'Location parameters (lat, lon) or city name required' },
        { status: 400 }
      );
    }

    // If API key is not configured, return mock data
    if (API_KEY === 'demo_key' || !API_KEY) {
      console.log('Using mock weather data - API key not configured');
      return NextResponse.json({
        success: true,
        data: mockWeatherData,
        location: {
          name: city || 'Demo Location',
          country: 'ZA',
          lat: parseFloat(lat || '0'),
          lon: parseFloat(lon || '0')
        },
        source: 'mock'
      });
    }

    console.log('Using OpenWeatherMap API with key:', API_KEY.substring(0, 8) + '...');
    
    let weatherUrl = '';
    
    if (lat && lon) {
      // Use coordinates
      weatherUrl = `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,alerts`;
    } else if (city) {
      // First get coordinates for the city
      const geoUrl = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}`;
      const geoResponse = await fetch(geoUrl);
      
      if (!geoResponse.ok) {
        return NextResponse.json(
          { error: 'City not found' },
          { status: 404 }
        );
      }
      
      const geoData = await geoResponse.json();
      const { lat: cityLat, lon: cityLon } = geoData.coord;
      
      weatherUrl = `${BASE_URL}/onecall?lat=${cityLat}&lon=${cityLon}&appid=${API_KEY}&units=metric&exclude=minutely,hourly,alerts`;
    }

    const response = await fetch(weatherUrl);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform the data to match our expected format
    const weatherData = {
      current: {
        temp: Math.round(data.current.temp),
        feels_like: Math.round(data.current.feels_like),
        humidity: data.current.humidity,
        pressure: data.current.pressure,
        wind_speed: data.current.wind_speed,
        wind_deg: data.current.wind_deg,
        weather: data.current.weather,
        visibility: data.current.visibility,
        uv_index: data.current.uvi
      },
      daily: data.daily.slice(0, 7).map((day: any) => ({
        dt: day.dt,
        temp: {
          min: Math.round(day.temp.min),
          max: Math.round(day.temp.max)
        },
        humidity: day.humidity,
        pressure: day.pressure,
        wind_speed: day.wind_speed,
        wind_deg: day.wind_deg,
        weather: day.weather,
        pop: day.pop
      }))
    };

    return NextResponse.json({
      success: true,
      data: weatherData,
      location: {
        name: data.timezone?.split('/')[1]?.replace('_', ' ') || city || 'Unknown',
        country: data.timezone?.split('/')[0] || 'ZA',
        lat: parseFloat(lat || '0'),
        lon: parseFloat(lon || '0')
      },
      source: 'api'
    });

  } catch (error) {
    console.error('Weather API error:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      success: true,
      data: mockWeatherData,
      location: {
        name: 'Demo Location',
        country: 'ZA',
        lat: 0,
        lon: 0
      },
      source: 'fallback'
    });
  }
}
