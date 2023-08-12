import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config';

const SUNRISE_SUNSET_ENDPOINT = '/sunrise_sunset';
const API_URL = `${apiUrl}${SUNRISE_SUNSET_ENDPOINT}`; 

interface SunriseSunsetResult {
  dawn: string;
  day_length: string;
  dusk: string;
  first_light: string;
  golden_hour: string;
  last_light: string;
  solar_noon: string;
  sunrise: string;
  sunset: string;
  timezone: string;
  utc_offset: number;
}

interface SunriseSunsetResponse {
  results: SunriseSunsetResult;
  status: string;
}

interface SunriseSunsetData {
  sunrise_sunset: SunriseSunsetResponse;
  timestamp: string;
}

const SunInfoComponent: React.FC = () => {
  const [sunriseSunsetData, setSunriseSunsetData] = useState<SunriseSunsetData | null>(null);

  useEffect(() => {
    async function fetchSunriseSunsetData() {
      try {
        const response = await fetch(API_URL);
        const data: SunriseSunsetData = await response.json();
        setSunriseSunsetData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchSunriseSunsetData();
  }, []);

  return (
    <div>
      <h2>Sunrise and Sunset Times</h2>
      {sunriseSunsetData ? (
        <table style={{ tableLayout: 'fixed', width: '100%' }}>
          <thead>
            <tr>
              <th>
                <div>
                  🌅 Sunrise
                </div>
              </th>
              <th>
                <div>
                  🌇 Sunset
                </div>
              </th>
              <th>
                <div>
                 📆 Day Length
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>
                  {sunriseSunsetData.sunrise_sunset.results.sunrise}
                </div>
              </td>
              <td>{sunriseSunsetData.sunrise_sunset.results.sunset}</td>
              <td>{sunriseSunsetData.sunrise_sunset.results.day_length}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        <p>Loading sunrise and sunset data...</p>
      )}
    </div>
  );
};

export default SunInfoComponent;