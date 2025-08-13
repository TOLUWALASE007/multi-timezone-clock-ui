import { useEffect, useState } from 'react';

type ClockDigitalProps = {
  timezone: string;
  city: string;
  country: string;
};

export const ClockDigital = ({ timezone, city, country }: ClockDigitalProps) => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    ampm: 'AM',
    date: '',
  });

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
          timeZone: timezone,
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: true,
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        };
        
        const formatter = new Intl.DateTimeFormat('en-US', options);
        const parts = formatter.formatToParts(now);
        
        let hours = 0, minutes = 0, seconds = 0, ampm = 'AM', month = '', day = '', year = '';
        
        parts.forEach(part => {
          switch (part.type) {
            case 'hour': hours = parseInt(part.value); break;
            case 'minute': minutes = parseInt(part.value); break;
            case 'second': seconds = parseInt(part.value); break;
            case 'dayPeriod': ampm = part.value; break;
            case 'month': month = part.value; break;
            case 'day': day = part.value; break;
            case 'year': year = part.value; break;
          }
        });
        
        setTime({
          hours,
          minutes,
          seconds,
          ampm,
          date: `${month} ${day}, ${year}`,
        });
      } catch (error) {
        console.error(`Invalid timezone: ${timezone}`, error);
        // Fallback to local time if timezone is invalid
        const now = new Date();
        setTime({
          hours: now.getHours(),
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
          ampm: now.getHours() >= 12 ? 'PM' : 'AM',
          date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  return (
    <div className="text-center mt-6">
      <div className="text-5xl font-bold dark:text-white text-gray-800 mb-2">
        {time.hours.toString().padStart(2, '0')}:
        {time.minutes.toString().padStart(2, '0')}
        <span className="text-2xl ml-2">{time.ampm}</span>
      </div>
      <div className="text-lg text-gray-600 dark:text-gray-300 mb-4">{time.date}</div>
      <div className="text-2xl font-semibold dark:text-white text-gray-800 mb-2">{city}</div>
      <div className="text-lg text-gray-500 dark:text-gray-400 mb-1">{country}</div>
      <div className="text-sm text-gray-400 dark:text-gray-500 font-mono">{timezone}</div>
    </div>
  );
};
