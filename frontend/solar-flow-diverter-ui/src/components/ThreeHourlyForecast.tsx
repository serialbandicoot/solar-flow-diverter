import React, { useEffect, useState } from 'react';
import { apiUrl } from '../config';
import WeatherIcon from './WeatherIcon';
import Compass from './Compass';
import WindSpeed from './WindSpeed';
import Humidity from './Humidity';
import Temperature from './Temperature';
import ChanceOfRain from './ChanceOfRain';

interface WeatherEntry {
  $: string;
  D: string;
  F: string;
  G: string;
  H: string;
  Pp: string;
  S: string;
  T: string;
  U: string;
  V: string;
  W: string;
}

const WeatherTable: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherEntry[]>([]);
  const [timeColumns, setTimeColumns] = useState<string[]>([]);

  useEffect(() => {
  const fetchWeatherData = async () => {
    try {
      const response = await fetch(apiUrl + '/weather?step=3h');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const periodData = data.three_hour.SiteRep.DV.Location.Period[1];
      const repData = periodData.Rep;

      // Convert current time to minutes past midnight
      const currentTime = new Date().getHours() * 60 + new Date().getMinutes();

      // Filter out past entries and show all entries if less than 3
      const futureEntries = repData.filter(entry => parseInt(entry.$, 10) >= currentTime);
      const finalWeatherData = futureEntries.length < 3 ? repData : futureEntries;

      setWeatherData(finalWeatherData);

      // Extract time values and set as column headers
      const times = finalWeatherData.map((entry: WeatherEntry) => {
        const timeMinutes = parseInt(entry.$, 10);
        const startHours = Math.floor(timeMinutes / 60);
        const startMinutes = timeMinutes % 60;
        const startDate = new Date(0, 0, 0, startHours, startMinutes);
        const startTime = startDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const endMinutes = timeMinutes + 180;
        const endHours = Math.floor(endMinutes / 60);
        const endMinutesPart = endMinutes % 60;
        const endDate = new Date(0, 0, 0, endHours, endMinutesPart);
        const endTime = endDate.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        return `${startTime} - ${endTime}`;
      });

      setTimeColumns(times);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  fetchWeatherData();
}, []);




  return (
    <div className="weather-table">
      <table>
        <thead>
          <tr>
            {timeColumns.map((time, index) => (
              <th key={index}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {weatherData.map((entry: WeatherEntry, index: number) => (
              <td key={index}>
                <div className="weather-data">
                  <div className="temperature-and-compass">
                    <div className="temperature">
                      <Temperature temperature={entry.T} />
                    </div>
                    <div className="compass">
                      <Compass windDirection={entry.D} />
                    </div>
                  </div>
                  <div className="wind-and-humidity">
                    <div className="wind-speed">
                      <WindSpeed windSpeed={entry.S} />
                    </div>
                    <div className="humidity">
                      <Humidity humidity={entry.H} />
                    </div>
                    <div className="chance-of-rain">
                      <ChanceOfRain percentage={entry.Pp} />
                    </div>
                  </div>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeatherTable;
