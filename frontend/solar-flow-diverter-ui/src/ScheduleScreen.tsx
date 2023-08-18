import React, { useState, useEffect } from 'react';
import { apiUrl } from './config';
import Header from './components/Header';

const ScheduleScreen: React.FC = () => {
  const [data, setData] = useState<string>(''); // You can replace 'string' with the appropriate data type
  const [time, setTime] = useState<string>(''); // You can replace 'string' with the appropriate data type

  const SCHEDULE_ENDPOINT = '/schedule';
  const API_URL = `${apiUrl}${SCHEDULE_ENDPOINT}`;

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const responseData = await response.json();
      setData(responseData); // Update the data state with fetched data
      setTime(Date().toLocaleString()); // Update the data state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially when the component mounts
    fetchData();

    // Set up the interval to poll every 5 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000); // 5 minutes in milliseconds

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []); // Empty dependency array to run the effect only once

  const containerStyle: React.CSSProperties = {
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '10px',
    flex: 1,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '64px',
    cursor: 'pointer',
    outline: 'none',
  };

  const isBatteryClicked = false;
  const isWaterTankClicked = false;
  const isGridClicked = false;

  return (
    <div>
      <Header />
      <h2>Notifications</h2>
      <p>Battery Notifications will trigger when the threshold is 85%.</p>
      <p>Water Notifications will trigger when the threshold is 70%.</p>
      <p>Notifications will be sent when the Grid is receiving imports.</p>
      <div>
      <div style={containerStyle}>
        <button
          style={{
            ...buttonStyle,
            background: isBatteryClicked ? '#F7AD40' : 'transparent',
          }}
        >
          🔋
        </button>
        <button
          style={{
            ...buttonStyle,
            background: isWaterTankClicked ? '#F7AD40' : 'transparent',
          }}
        >
          🚰
        </button>
        <button
          style={{
            ...buttonStyle,
            background: isGridClicked ? '#F7AD40' : 'transparent',
          }}

        >
          🏭
        </button>
      </div>
    </div>
    </div>
  );
};

export default ScheduleScreen;
