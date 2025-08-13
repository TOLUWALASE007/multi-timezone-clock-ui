import React, { useRef, useEffect } from 'react';

type City = {
  timezone: string;
  city: string;
  country: string;
};

type CitySelectorProps = {
  cities: City[];
  selectedCity: City;
  onCityChange: (city: City) => void;
};

export const CitySelector: React.FC<CitySelectorProps> = ({ 
  cities, 
  selectedCity, 
  onCityChange 
}) => {
  const selectRef = useRef<HTMLSelectElement>(null);

  // Auto-scroll to selected city when dropdown opens
  useEffect(() => {
    const select = selectRef.current;
    if (!select) return;

    const handleFocus = () => {
      // Small delay to ensure the dropdown is fully open
      setTimeout(() => {
        try {
          // Try to scroll to the selected option
          if (select.selectedIndex >= 0) {
            // Method 1: Try to set scrollTop (works in some browsers)
            const optionHeight = 20; // Approximate height of each option
            const scrollPosition = select.selectedIndex * optionHeight;
            select.scrollTop = scrollPosition;
            
            // Method 2: Try to focus the selected option (more reliable)
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
              selectedOption.scrollIntoView({ 
                block: 'center',
                behavior: 'smooth'
              });
            }
          }
        } catch (error) {
          // Fallback: just ensure the dropdown is visible
          console.log('Auto-scroll not supported in this browser');
        }
      }, 100); // Increased delay for better reliability
    };

    select.addEventListener('focus', handleFocus);
    
    return () => {
      select.removeEventListener('focus', handleFocus);
    };
  }, [selectedCity]);

  return (
    <div className="relative">
      <label htmlFor="city-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-center">
        Select a City
      </label>
      <select
        ref={selectRef}
        id="city-select"
        value={selectedCity.timezone}
        onChange={(e) => {
          const city = cities.find(c => c.timezone === e.target.value);
          if (city) onCityChange(city);
        }}
        className="w-full px-4 py-3 text-lg font-medium bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg dark:shadow-gray-800 transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500 cursor-pointer"
        title={`Currently viewing: ${selectedCity.city}, ${selectedCity.country}`}
      >
        {cities.map((city) => (
          <option 
            key={city.timezone} 
            value={city.timezone}
            className={city.timezone === selectedCity.timezone ? 'font-bold bg-blue-100 dark:bg-blue-900' : ''}
          >
            {city.city}, {city.country}
          </option>
        ))}
      </select>
    </div>
  );
};
