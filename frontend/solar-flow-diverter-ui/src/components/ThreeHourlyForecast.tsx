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

      // Filter out past entries and show all entries if less than 3
      const currentTime = new Date().getHours() * 60 + new Date().getMinutes();
      const futureEntries = repData.filter(entry => parseInt(entry.$, 10) >= currentTime);
      const finalWeatherData = futureEntries.length < 3 ? repData : futureEntries;

      setWeatherData(finalWeatherData);

      // Extract time values and set as column headers
      const times = finalWeatherData.map((entry: WeatherEntry) => {
        const timeMinutes = parseInt(entry.$, 10);
        const hours = Math.floor(timeMinutes / 60);
        const minutes = timeMinutes % 60;
        const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const endTimeHours = Math.floor((timeMinutes + 180) / 60);
        const endTimeMinutes = (timeMinutes + 180) % 60;
        const endTime = `${endTimeHours.toString().padStart(2, '0')}:${endTimeMinutes.toString().padStart(2, '0')}`;
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
