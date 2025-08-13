import { ClockAnalog } from './ClockAnalog';
import { ClockDigital } from './ClockDigital';

type ClockProps = {
  timezone: string;
  city: string;
  country: string;
};

export const Clock = ({ timezone, city, country }: ClockProps) => {
  return (
    <div className="p-8 rounded-2xl bg-white dark:bg-gray-700 shadow-xl dark:shadow-gray-900 transition-colors duration-300 hover:shadow-2xl dark:hover:shadow-gray-800 border border-gray-200 dark:border-gray-600">
      <ClockAnalog timezone={timezone} />
      <ClockDigital timezone={timezone} city={city} country={country} />
    </div>
  );
};
