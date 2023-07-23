import React, { useEffect, useState } from 'react';
import WeatherIcon from './WeatherIcon'
import './index.css';

interface Props {}

interface WeatherData {
  Rep: {
    $: string;
    Dm: string;
    V: string;
    W: string;
    // Add other fields as needed based on the actual response structure
  }[];
  type: string;
  value: string;
}

const VISIBILITY: { [key: string]: string } = {
  UN: "Unknown",
  VP: "Very poor - Less than 1 km",
  PO: "Poor - Between 1-4 km",
  MO: "Moderate - Between 4-10 km",
  GO: "Good - Between 10-20 km",
  VG: "Very good - Between 20-40 km",
  EX: "Excellent - More than 40 km",
};

const WEATHER_CODES: { [key: string]: string } = {
  "NA": "Not available",
  "0": "Clear night",
  "1": "Sunny day",
  "2": "Partly cloudy (night)",
  "3": "Partly cloudy (day)",
  "4": "Not used",
  "5": "Mist",
  "6": "Fog",
  "7": "Cloudy",
  "8": "Overcast",
  "9": "Light rain shower (night)",
  "10": "Light rain shower (day)",
  "11": "Drizzle",
  "12": "Light rain",
  "13": "Heavy rain shower (night)",
  "14": "Heavy rain shower (day)",
  "15": "Heavy rain",
  "16": "Sleet shower (night)",
  "17": "Sleet shower (day)",
  "18": "Sleet",
  "19": "Hail shower (night)",
  "20": "Hail shower (day)",
  "21": "Hail",
  "22": "Light snow shower (night)",
  "23": "Light snow shower (day)",
  "24": "Light snow",
  "25": "Heavy snow shower (night)",
  "26": "Heavy snow shower (day)",
  "27": "Heavy snow",
  "28": "Thunder shower (night)",
  "29": "Thunder shower (day)",
  "30": "Thunder",
};

const SevenDayForecast: React.FC<Props> = () => {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/get_metoffice_data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        const locationName = data.SiteRep.DV.Location.name;
        setLocationName(locationName);
        setWeatherData(data.SiteRep.DV.Location.Period); // Assuming data is an array of WeatherData
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

  return (
    <div className="componentTop">
      <h2>5 Day Forecast ({locationName})</h2>
      <table>
        <thead>
          <tr>
            {fiveDayForecast.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
        <tr>
            {weatherData.map((period, periodIndex) => {
              const temperature = parseInt(period.Rep[0].Dm, 10);
              return (
                <td key={periodIndex} className="centered-td">
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
                      }}
                    >
                      {temperature}&deg;C
                    </div>
                    <WeatherIcon number={period.Rep[0].W} />
                  </div>
                  <p>{WEATHER_CODES[period.Rep[0].W]} with visibility {VISIBILITY[period.Rep[0].V]}</p>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SevenDayForecast;
