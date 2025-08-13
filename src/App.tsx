import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { Clock } from './components/Clock';
import { CitySelector } from './components/CitySelector';
import { CityInfo } from './components/CityInfo';
import { useState } from 'react';

const cities = [
  { timezone: 'Africa/Lagos', city: 'Lagos', country: 'Nigeria' },
  { timezone: 'America/New_York', city: 'New York', country: 'USA' },
  { timezone: 'Europe/London', city: 'London', country: 'UK' },
  { timezone: 'Asia/Tokyo', city: 'Tokyo', country: 'Japan' },
  { timezone: 'Australia/Sydney', city: 'Sydney', country: 'Australia' },
  { timezone: 'America/Los_Angeles', city: 'Los Angeles', country: 'USA' },
  { timezone: 'Europe/Paris', city: 'Paris', country: 'France' },
  { timezone: 'Asia/Dubai', city: 'Dubai', country: 'UAE' },
  { timezone: 'America/Chicago', city: 'Chicago', country: 'USA' },
  { timezone: 'Asia/Shanghai', city: 'Shanghai', country: 'China' },
  { timezone: 'Europe/Berlin', city: 'Berlin', country: 'Germany' },
  { timezone: 'Asia/Kolkata', city: 'Mumbai', country: 'India' }, // Correct timezone for Mumbai
  { timezone: 'America/Toronto', city: 'Toronto', country: 'Canada' },
  { timezone: 'Europe/Moscow', city: 'Moscow', country: 'Russia' },
  { timezone: 'Asia/Singapore', city: 'Singapore', country: 'Singapore' },
  { timezone: 'America/Sao_Paulo', city: 'São Paulo', country: 'Brazil' },
  { timezone: 'Africa/Cairo', city: 'Cairo', country: 'Egypt' },
  { timezone: 'Asia/Seoul', city: 'Seoul', country: 'South Korea' },
  { timezone: 'Europe/Rome', city: 'Rome', country: 'Italy' },
  { timezone: 'America/Mexico_City', city: 'Mexico City', country: 'Mexico' },
  { timezone: 'Asia/Bangkok', city: 'Bangkok', country: 'Thailand' },
  { timezone: 'Europe/Amsterdam', city: 'Amsterdam', country: 'Netherlands' },
  { timezone: 'Asia/Jakarta', city: 'Jakarta', country: 'Indonesia' },
  { timezone: 'Europe/Stockholm', city: 'Stockholm', country: 'Sweden' },
  { timezone: 'America/Buenos_Aires', city: 'Buenos Aires', country: 'Argentina' }
];

function App() {
  const [selectedCity, setSelectedCity] = useState(cities[0]); // Default to Lagos

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-comic transition-colors duration-300">
        <div className="container mx-auto px-4 py-8 relative">
          <ThemeToggle />
          
          {/* Header with better mobile spacing */}
          <header className="pt-12 md:pt-16 mb-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center dark:text-white text-gray-800 leading-tight mb-8">
              World Clock
            </h1>
            
            {/* City Selector */}
            <div className="max-w-md mx-auto">
              <CitySelector 
                cities={cities} 
                selectedCity={selectedCity} 
                onCityChange={setSelectedCity} 
              />
            </div>
          </header>
          
          {/* Main Content */}
          <div className="max-w-4xl mx-auto">
            {/* Single Clock Display */}
            <div className="flex justify-center mb-8">
              <Clock
                timezone={selectedCity.timezone}
                city={selectedCity.city}
                country={selectedCity.country}
              />
            </div>
            
            {/* Enhanced City Information */}
            <div className="mt-8">
              <CityInfo 
                city={selectedCity.city}
                country={selectedCity.country}
              />
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
