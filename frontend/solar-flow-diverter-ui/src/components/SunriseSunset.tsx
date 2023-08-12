import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config';

interface SunriseSunsetData {
  results: {
    sunrise: string;
    sunset: string;
    first_light: string;
    last_light: string;
    dawn: string;
    dusk: string;
    solar_noon: string;
    golden_hour: string;
    day_length: string;
    timezone: string;
    utc_offset: number;
  };
  status: string;
}

const SunInfoComponent: React.FC = () => {
  const [sunriseSunsetData, setSunriseSunsetData] = useState<SunriseSunsetData | null>(null);

  useEffect(() => {
    const SUNRISE_SUNSET_ENDPOINT = '/sunrise_sunset';
    const API_URL = `${apiUrl}${SUNRISE_SUNSET_ENDPOINT}`; // Replace apiUrl with the actual API URL

    async function fetchSunriseSunsetData() {
      try {
        const response = await fetch(API_URL); // Use the API_URL variable here
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
        <div>
          <p>Sunrise: {sunriseSunsetData.results.sunrise}</p>
          <p>Sunset: {sunriseSunsetData.results.sunset}</p>
          <p>Day Length: {sunriseSunsetData.results.day_length}</p>
        </div>
      ) : (
        <p>Loading sunrise and sunset data...</p>
      )}
    </div>
  );
};

export default SunInfoComponent;

