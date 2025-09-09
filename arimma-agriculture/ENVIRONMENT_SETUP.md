# Environment Setup Instructions

## Weather API Configuration

To enable real weather data instead of mock data, create a `.env.local` file in the root directory with the following content:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=arimma_db

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# OpenWeatherMap API Key
OPENWEATHER_API_KEY=c760ad938ec96eb5c55866a3eb920265
```

## Steps to Set Up:

1. Create a file named `.env.local` in the root directory (`arimma-agriculture/.env.local`)
2. Copy the content above into the file
3. Save the file
4. Restart the development server (`npm run dev`)

## Current Status:

The API key has been temporarily hardcoded in the weather API route as a fallback, so the weather functionality will work with real data even without the environment file. However, it's recommended to use the environment file for better security and configuration management.

## Testing:

After setting up the environment file:
1. Go to the Weather page
2. Search for a city (e.g., "Johannesburg", "Cape Town", "Durban")
3. You should see real weather data from OpenWeatherMap API
4. Check the browser console for API usage logs
