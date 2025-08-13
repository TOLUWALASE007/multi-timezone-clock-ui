import React, { useEffect, useState } from 'react';
import { getCityWeather } from '../services/api';

type WeatherData = {
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  feels_like: number;
};

type WeatherDisplayProps = {
  city: string;
  country: string;
};

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ city, country }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const weatherData = await getCityWeather(city, country);
        setWeather(weatherData);
      } catch (err) {
        setError('Failed to load weather');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (city && country) {
      fetchWeather();
    }
  }, [city, country]);

  if (loading) {
    return (
      <div className="text-center py-2">
        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="text-center py-2">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          Weather information unavailable
        </span>
      </div>
    );
  }

  return (
    <div className="text-center py-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3">
      <div className="flex items-center justify-center space-x-2">
        <img 
          src={`http://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
          alt={weather.description}
          className="w-8 h-8"
        />
        <div className="text-left">
          <div className="text-lg font-semibold text-gray-800 dark:text-white">
            {weather.temperature}°C
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-300 capitalize">
            {weather.description}
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Feels like {weather.feels_like}°C • {weather.humidity}% humidity
      </div>
    </div>
  );
};
