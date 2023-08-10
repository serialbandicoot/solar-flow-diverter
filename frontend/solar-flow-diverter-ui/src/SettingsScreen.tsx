import React, { useState, useEffect } from 'react';
import { apiUrl } from './config';
import Header from './components/Header';
import HomeSensorPrioritySelector from './components/HomeSensorPrioritySelector';

interface SettingsData {
  solis_key_id: string;
  solis_secret_key: string;
  solis_plant_id: string;
  solis_station_id: string;
  solis_serial_number: string;
  solis_domain: string;
  solis_username: string;
  met_office_api_key: string;
  lat: string;
  long: string;
}

const SETTINGS_ENDPOINT = '/settings';
const API_URL = `${apiUrl}${SETTINGS_ENDPOINT}`;

const DataComponent: React.FC = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Check if data exists and has elements
        if (data) {
          setData(data);
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
        <div>{data.solis_key_id ? '***' : 'MISSING'}</div>
        <div>secret_key:</div>
        <div>{data.solis_secret_key ? '***' : 'MISSING'}</div>
        <div>plant_id:</div>
        <div>{data.solis_plant_id || 'MISSING'}</div>
        <div>station_id:</div>
        <div>{data.solis_station_id || 'MISSING'}</div>
        <div>serial_number:</div>
        <div>{data.solis_serial_number || 'MISSING'}</div>
        <div>portal_domain:</div>
        <div>{data.solis_domain || 'MISSING'}</div>
        <div>portal_username:</div>
        <div>{data.solis_username || 'MISSING'}</div>
        <div>met_office_api_key:</div>
        <div>{data.met_office_api_key ? '***' : 'MISSING'}</div>
        <div>latitude:</div>
        <div>{data.lat || 'MISSING'}</div>
        <div>longitude:</div>
        <div>{data.long || 'MISSING'}</div>
        <div>Excess Priority:</div>
        <HomeSensorPrioritySelector />
      </div>
    </div>
  );

};

export default DataComponent;
