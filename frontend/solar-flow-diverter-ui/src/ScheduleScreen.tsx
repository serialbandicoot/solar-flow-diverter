import React, { useState, useEffect } from 'react';
import { apiUrl } from './config';
import { BatteryGraph } from './components/BatteryGraph';

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

  return (
    <div>
      <h1>Hello Schedule</h1>
      <p>Data from the API: {data.toString()}</p>
      <p>Data from the API: {time}</p>
      <BatteryGraph />
    </div>
  );
};

export default ScheduleScreen;
