import { useEffect, useState } from 'react';

type ClockAnalogProps = {
  timezone: string;
};

export const ClockAnalog = ({ timezone }: ClockAnalogProps) => {
  const [time, setTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
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
          hour12: false,
        };
        
        const timeString = new Intl.DateTimeFormat('en-US', options).format(now);
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        
        setTime({
          hours: hours % 12,
          minutes,
          seconds,
        });
      } catch (error) {
        console.error(`Invalid timezone: ${timezone}`, error);
        // Fallback to local time if timezone is invalid
        const now = new Date();
        setTime({
          hours: now.getHours() % 12,
          minutes: now.getMinutes(),
          seconds: now.getSeconds(),
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const hourRotation = (time.hours % 12) * 30 + time.minutes * 0.5;
  const minuteRotation = time.minutes * 6;
  const secondRotation = time.seconds * 6;

  // Clock face radius (120px for w-60 h-60)
  const radius = 120;
  // Distance from center to markers (110px from center)
  const markerDistance = 110;

  return (
    <div className="relative w-60 h-60 rounded-full bg-gray-100 dark:bg-gray-800 shadow-lg dark:shadow-gray-900 mx-auto">
      {/* Clock marks */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => {
        // Calculate position using trigonometry
        const angle = (i * 30 - 90) * (Math.PI / 180); // Start from 12 o'clock (-90 degrees)
        const x = radius + markerDistance * Math.cos(angle);
        const y = radius + markerDistance * Math.sin(angle);
        
        return (
          <div
            key={i}
            className={`absolute rounded-full ${
              i % 3 === 0 ? 'w-2 h-2 bg-gray-600 dark:bg-gray-300' : 'w-1.5 h-1.5 bg-gray-500'
            }`}
            style={{
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}
      
      {/* Clock hands - shortened to fit within clock face */}
      <div
        className="absolute left-1/2 top-1/2 w-1.5 h-20 bg-gray-800 dark:bg-gray-200 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-out"
        style={{ transform: `translate(-50%, -100%) rotate(${hourRotation}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-1.5 h-28 bg-gray-600 dark:bg-gray-300 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-out"
        style={{ transform: `translate(-50%, -100%) rotate(${minuteRotation}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-1 h-28 bg-red-500 origin-bottom transform -translate-x-1/2 -translate-y-full transition-transform duration-1000 ease-out"
        style={{ transform: `translate(-50%, -100%) rotate(${secondRotation}deg)` }}
      />
      
      {/* Center dot */}
      <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
};
