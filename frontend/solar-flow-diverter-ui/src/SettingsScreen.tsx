import React, { useState, useEffect } from 'react';
import { apiUrl } from './config';
import Header from './components/Header';
import HomeSensorPrioritySelector from './components/HomeSensorPrioritySelector';

interface SettingsData {
  solis_key_id?: string;
  solis_secret_key?: string;
  solis_plant_id?: string;
  solis_station_id?: string;
  solis_serial_number?: string;
  solis_domain?: string;
  solis_username?: string;
  met_office_api_key?: string;
  lat: string;
  long: string;
}

const SETTINGS_ENDPOINT = '/settings';
const API_URL = `${apiUrl}${SETTINGS_ENDPOINT}`;

const DataComponent: React.FC = () => {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Check if data exists and has elements
        if (data) {
          setData(data);
          setLatitude(data.lat)
          setLongitude(data.long)
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

  const handleUpdateClick = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lat: latitude, long: longitude }),
      });

      if (response.ok) {
        // Update local data with new values
        setData((prevData) => ({
          ...prevData!,
          lat: latitude,
          long: longitude,
        }));
        setLatitude(latitude);
        setLongitude(longitude);
      } else {
        console.error('Failed to update latitude and longitude.');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>No data found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="data-container">
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
        <div>Coordinates -&gt;</div>
        <div>
          <input
            type="text"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            style={{
              fontSize: '18px',
              padding: '5px',
              width: '110px',
              marginBottom: '10px',
            }}
          />
          <span style={{ marginLeft: '5px' }}>Latitude</span>
        </div>
        <div></div>
        <div>
          <input
            type="text"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            style={{
              fontSize: '18px',
              padding: '5px',
              width: '110px',
              marginBottom: '10px',
            }}
          />
          <span style={{ marginLeft: '5px' }}>Longitude</span>
          <div></div>
          <button 
          onClick={handleUpdateClick}
          style={{
            fontSize: '18px',
            padding: '6px',
            color: 'white',
            backgroundColor: '#F7AD40',
            border: 'none',
            cursor: 'pointer',
          }}>
            Update
          </button>
        </div>
        <div>Excess Priority -&gt;</div>
        <HomeSensorPrioritySelector />
      </div>
    </div>
  );
};

export default DataComponent;
