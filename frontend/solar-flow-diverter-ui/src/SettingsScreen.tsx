import React, { useState, useEffect } from 'react';
import { apiUrl } from './config';
import Header from './components/Header';

interface PlantData {
  KEY_ID: string;
  SECRET_KEY: string;
  PLANT_ID: string;
  STATION_ID: string;
  SERIAL_NUMBER: string;
  PORTAL_DOMAIN: string;
  PORTAL_USERNAME: string;
  MET_OFFICE_API_KEY: string;
  LAT: string;
  LONG: string;
}

interface ApiData {
  timestamp: string;
  plant: PlantData[];
  id: number;
}

const SETTINGS_ENDPOINT = '/settings';
const API_URL = `${apiUrl}${SETTINGS_ENDPOINT}`;

const DataComponent: React.FC = () => {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Check if data exists and has elements
        if (Array.isArray(data) && data.length > 0) {
          setData(data[0]);
        } else {
          console.error('No data found in the API response.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  // ... Inside the return statement ...

  return (
    <div>
      <Header/>
      <div className="data-container"> {/* Apply the CSS class here */}
        <div>key_id:</div>
        <div>{data.plant[0]?.KEY_ID ? '***' : 'MISSING'}</div>
        <div>secret_key:</div>
        <div>{data.plant[0]?.SECRET_KEY ? '***' : 'MISSING'}</div>
        <div>plant_id:</div>
        <div>{data.plant[0]?.PLANT_ID || 'MISSING'}</div>
        <div>station_id:</div>
        <div>{data.plant[0]?.STATION_ID || 'MISSING'}</div>
        <div>serial_number:</div>
        <div>{data.plant[0]?.SERIAL_NUMBER || 'MISSING'}</div>
        <div>portal_domain:</div>
        <div>{data.plant[0]?.PORTAL_DOMAIN || 'MISSING'}</div>
        <div>portal_username:</div>
        <div>{data.plant[0]?.PORTAL_USERNAME || 'MISSING'}</div>
        <div>met_office_api_key:</div>
        <div>{data.plant[0]?.MET_OFFICE_API_KEY ? '***' : 'MISSING'}</div>
        <div>latitude:</div>
        <div>{data.plant[0]?.LAT || 'MISSING'}</div>
        <div>longitude:</div>
        <div>{data.plant[0]?.LONG || 'MISSING'}</div>
      </div>
    </div>
  );

};

export default DataComponent;
