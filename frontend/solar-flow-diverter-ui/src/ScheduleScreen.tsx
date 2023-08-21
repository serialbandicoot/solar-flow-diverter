import React, { useState, useEffect } from 'react';
import { apiUrl } from './config';
import Header from './components/Header';
import Notifications from './components/Notifications';

const ScheduleScreen: React.FC = () => {
  const [batteryThreshold, setBatteryThreshold] = useState<number>(0);
  const [waterThreshold, setWaterThreshold] = useState<number>(0);

  const PRIORITIES_ENDPOINT = '/priorities';
  const API_URL = `${apiUrl}${PRIORITIES_ENDPOINT}`;

  // Function to fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const responseData = await response.json();
      setBatteryThreshold(responseData.excess_priority.battery_threshold);
      setWaterThreshold(responseData.excess_priority.water_threshold);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially when the component mounts
    fetchData();

  }, []); 

  return (
    <div>
      <Header />
      <Notifications />
      <h2>Notification Schedule</h2>
      <p>Battery Notifications will trigger when the threshold is {batteryThreshold}%.</p>
      <p>Water Notifications will trigger when the threshold is {waterThreshold}%.</p>
      <p>Notifications will be sent when the Grid is receiving imports.</p>
    </div>
  );
};

export default ScheduleScreen;
