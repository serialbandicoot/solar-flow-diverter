import React, { useEffect, useState } from 'react';
import WeatherIcon from './components/WeatherIcon';
import './index.css';

import { apiUrl } from './config';

interface Props {}

interface RepData {
  day: string;
  Dm: string;
  W: string;
  V: string;
}

interface PeriodData {
  Rep: Array<RepData>;
  type: string;
  value: string;
}

const VISIBILITY: { [key: string]: string } = {
  UN: 'unknown',
  VP: 'very poor',
  PO: 'poor',
  MO: 'moderate',
  GO: 'good',
  VG: 'very good',
  EX: 'excellent',
};

const WEATHER_CODES: { [key: string]: string } = {
  NA: 'Not available',
  '0': 'Clear night',
  '1': 'Sunny day',
  '2': 'Partly cloudy (night)',
  '3': 'Partly cloudy (day)',
  '4': 'Not used',
  '5': 'Mist',
  '6': 'Fog',
  '7': 'Cloudy',
  '8': 'Overcast',
  '9': 'Light rain shower (night)',
  '10': 'Light rain shower',
  '11': 'Drizzle',
  '12': 'Light rain',
  '13': 'Heavy rain shower (night)',
  '14': 'Heavy rain shower',
  '15': 'Heavy rain',
  '16': 'Sleet shower (night)',
  '17': 'Sleet shower (day)',
  '18': 'Sleet',
  '19': 'Hail shower (night)',
  '20': 'Hail shower (day)',
  '21': 'Hail',
  '22': 'Light snow shower (night)',
  '23': 'Light snow shower (day)',
  '24': 'Light snow',
  '25': 'Heavy snow shower (night)',
  '26': 'Heavy snow shower (day)',
  '27': 'Heavy snow',
  '28': 'Thunder shower (night)',
  '29': 'Thunder shower (day)',
  '30': 'Thunder',
};


const FiveDayForecast: React.FC<Props> = () => {
  const [lastWeatherTimeStamp, setLastWeatherTimeStamp] = useState<string>('');
  const [weatherData, setWeatherData] = useState<PeriodData[]>([]);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(apiUrl + '/weather?step=5d');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const locationName = data.fiveDay.SiteRep.DV.Location.name;
        const timeStamp = data.timestamp;
        setLocationName(locationName);
        setWeatherData(data.fiveDay.SiteRep.DV.Location.Period);
        setLastWeatherTimeStamp(timeStamp);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, []);

  const rotateDays = (days: string[], offset: number): string[] => {
    const rotatedDays = [...days];
    for (let i = 0; i < offset; i++) {
      const day = rotatedDays.shift();
      if (day) rotatedDays.push(day);
    }
    return rotatedDays;
  };

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const rotatedDays = rotateDays(days, today.getDay());
  const fiveDayForecast = rotatedDays.slice(0, 5); // Get the first 5 days for the forecast

  const reloadPage = () => {
    window.location.reload(); // Reload the current page
  };

  useEffect(() => {
    // Schedule the page reload every 5 minutes (300,000 milliseconds)
    const interval = setInterval(reloadPage, 300000); // 5 minutes = 5 * 60 seconds * 1000 milliseconds

    // Clean up the interval when the component is unmounted
    return () => {
      console.log('** Page Refresh **');
      clearInterval(interval);
    };
  }, []);

  function toTitleCase(str: string): string {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
    });
  }

  const parseDate = (inputDate: string): String => {
    const dateObj = new Date(inputDate);
    return dateObj.toLocaleTimeString('en', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="componentTop">
      <h2>
        5 Day Forecast ({toTitleCase(locationName)} at{' '}
        {lastWeatherTimeStamp && parseDate(lastWeatherTimeStamp)})
      </h2>
      <table style={{ tableLayout: 'fixed', width: '100%' }}>
        <thead>
          <tr>
            {fiveDayForecast.map((_, index) => {
              const today = new Date();
              const currentDate = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() + index
              );
              const dayOfWeek = days[currentDate.getDay()];
              const month = currentDate.toLocaleString('en-US', { month: 'short' });
              const formattedDate = `${dayOfWeek} (${currentDate.getDate()}-${month})`;

              return <th key={index}>{formattedDate}</th>;
            })}
          </tr>
        </thead>

        <tbody>
          <tr>
            {weatherData.map((period, periodIndex) => {
              const temperature = parseInt(period.Rep[0].Dm, 10);
              return (
                <td key={periodIndex}>
                  <div className="centered-container">
                    <div
                      className="centered-div"
                      style={{
                        backgroundColor:
                          temperature >= 20
                            ? '#FF8C00' // Light Orange
                            : temperature >= 15
                            ? '#FFA500' // Yellow
                            : temperature >= 10
                            ? '#ADD8E6' // Light Blue
                            : temperature >= 5
                            ? '#0000FF' // Blue
                            : '#00008B', // Dark Blue
                        order: 2, // Default order for larger screens
                      }}
                    >
                      {temperature}&deg;C
                    </div>
                    <div className="weather-icon-wrapper">
                      <WeatherIcon number={period.Rep[0].W} />
                    </div>
                  </div>

                  <br/>
                  <div className="weather-description">
                    {WEATHER_CODES[period.Rep[0].W]} with visibility {VISIBILITY[period.Rep[0].V]}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FiveDayForecast;
