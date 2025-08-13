import React, { useEffect, useState } from 'react';
import { 
  getCityPhoto, 
  getCountryInfo, 
  getExchangeRate, 
  getCityInfo, 
  getCityDemographics,
  getHolidays
} from '../services/api';

type CityInfoProps = {
  city: string;
  country: string;
};

type CityData = {
  photo: string; // Never null - always guaranteed to have a working image
  countryInfo: any;
  exchangeRate: any;
  cityInfo: any;
  demographics: any;
  holidays: any[];
};

export const CityInfo: React.FC<CityInfoProps> = ({ city, country }) => {
  const [cityData, setCityData] = useState<CityData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCityData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch all data in parallel
        const [
          photo,
          countryInfo,
          exchangeRate,
          cityInfo,
          demographics,
          holidays
        ] = await Promise.all([
          getCityPhoto(city, country),
          getCountryInfo(getCountryCodeFromName(country)),
          getExchangeRate(getCountryCodeFromName(country)),
          getCityInfo(city, country),
          getCityDemographics(city, country),
          getHolidays(getCountryCodeFromName(country))
        ]);

        // Debug logging for photo
        console.log('✅ Working image guaranteed for', city);
        console.log('City:', city, 'Country:', country);
        console.log('Photo URL:', photo);

        // Debug logging for holidays
        console.log('🎉 Holiday data:', holidays);
        console.log('Country code for holidays:', getCountryCodeFromName(country));

        setCityData({
          photo,
          countryInfo,
          exchangeRate,
          cityInfo,
          demographics,
          holidays: holidays || []
        });
      } catch (err) {
        setError('Failed to load city information');
        console.error('City data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (city && country) {
      fetchCityData();
    }
  }, [city, country]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading city information...</span>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="text-center py-4">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          City information unavailable
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* City Photo - Always guaranteed to work */}
      <div className="relative overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-700 city-photo">
        <div className="aspect-video w-full">
          <img 
            src={cityData.photo} 
            alt={`${city}, ${country}`}
            className="w-full h-full object-cover object-center"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* City Info Overlay */}
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{city}</h3>
          <p className="text-sm opacity-90">{country}</p>
        </div>
      </div>

      {/* Country Information */}
      {cityData.countryInfo && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Country Information</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Capital:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{cityData.countryInfo.capital}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Population:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{cityData.countryInfo.population}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Region:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{cityData.countryInfo.region}</span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Area:</span>
              <span className="ml-2 text-gray-800 dark:text-white">{cityData.countryInfo.area}</span>
            </div>
            {cityData.countryInfo.flag && (
              <div className="col-span-2">
                <img 
                  src={cityData.countryInfo.flag} 
                  alt={`${country} flag`}
                  className="w-16 h-auto"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Currency & Exchange Rate */}
      {cityData.countryInfo?.currency && cityData.exchangeRate && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Currency</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Local Currency:</span>
              <span className="text-gray-800 dark:text-white font-medium">{cityData.countryInfo.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Exchange Rate:</span>
              <span className="text-gray-800 dark:text-white font-medium">
                1 {cityData.countryInfo.currency} = ${cityData.exchangeRate.rate?.toFixed(4) || 'N/A'} USD
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Cultural Information */}
      {cityData.cityInfo && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">About {city}</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {cityData.cityInfo.extract}
          </p>
          {cityData.cityInfo.url && (
            <a 
              href={cityData.cityInfo.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Read more on Wikipedia →
            </a>
          )}
        </div>
      )}

      {/* Upcoming Holidays */}
      {cityData.holidays && cityData.holidays.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">Holidays</h4>
          <div className="space-y-2">
            {(() => {
              const now = new Date();
              const currentYear = now.getFullYear();
              
              // Filter holidays for current year and sort by date
              const currentYearHolidays = cityData.holidays
                .filter(holiday => {
                  const holidayDate = new Date(holiday.date);
                  return holidayDate.getFullYear() === currentYear;
                })
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              
              // Separate upcoming and past holidays
              const upcomingHolidays = currentYearHolidays.filter(holiday => 
                new Date(holiday.date) > now
              );
              
              const pastHolidays = currentYearHolidays.filter(holiday => 
                new Date(holiday.date) <= now
              );
              
              // Show upcoming holidays first, then some past holidays
              const holidaysToShow = [...upcomingHolidays, ...pastHolidays].slice(0, 5);
              
              if (holidaysToShow.length === 0) {
                return (
                  <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                    No holidays available for this year
                  </div>
                );
              }
              
              return holidaysToShow.map((holiday, index) => {
                const holidayDate = new Date(holiday.date);
                const isUpcoming = holidayDate > now;
                const isToday = holidayDate.toDateString() === now.toDateString();
                
                return (
                  <div key={index} className={`flex justify-between items-center text-sm p-2 rounded ${
                    isToday ? 'bg-blue-100 dark:bg-blue-900' : 
                    isUpcoming ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <span className={`font-medium ${
                      isToday ? 'text-blue-800 dark:text-blue-200' :
                      isUpcoming ? 'text-green-700 dark:text-green-300' : 
                      'text-gray-700 dark:text-gray-300'
                    }`}>
                      {holiday.name}
                      {isToday && ' (Today!)'}
                      {isUpcoming && ' (Upcoming)'}
                    </span>
                    <span className={`text-sm ${
                      isToday ? 'text-blue-600 dark:text-blue-300' :
                      isUpcoming ? 'text-green-600 dark:text-green-400' : 
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {holidayDate.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        weekday: 'short'
                      })}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
          {cityData.holidays.length > 5 && (
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
              Showing 5 of {cityData.holidays.length} holidays
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Helper function to get country codes
const getCountryCodeFromName = (countryName: string): string => {
  const countryMap: { [key: string]: string } = {
    'Nigeria': 'NG',
    'USA': 'US',
    'UK': 'GB',
    'Japan': 'JP',
    'Australia': 'AU',
    'France': 'FR',
    'UAE': 'AE',
    'China': 'CN',
    'Germany': 'DE',
    'India': 'IN',
    'Canada': 'CA',
    'Russia': 'RU',
    'Singapore': 'SG',
    'Brazil': 'BR',
    'Egypt': 'EG',
    'South Korea': 'KR',
    'Italy': 'IT',
    'Mexico': 'MX',
    'Thailand': 'TH',
    'Netherlands': 'NL',
    'Indonesia': 'ID',
    'Sweden': 'SE',
    'Argentina': 'AR'
  };
  
  return countryMap[countryName] || '';
};
