import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config'; // Import the apiUrl from your configuration file
import './LightBulb.css'; // Import the CSS file for styles

const BATTERY_ENDPOINT = '/battery';
const API_URL = `${apiUrl}${BATTERY_ENDPOINT}`;

const LightBulb: React.FC = () => {
  const [batteryValue, setBatteryValue] = useState<number | null>(null);

  useEffect(() => {
    // Fetch the battery percentage from the API
    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch battery percentage');
        }
        return response.json();
      })
      .then((data) => {
        // Assuming the API returns a JSON object with a 'battery' property
        setBatteryValue(data.battery);
      })
      .catch((error) => {
        console.error('Error fetching battery percentage:', error);
      });
  }, []);

  const getFillColorClass = (batteryValue: number | null): string => {
    if (batteryValue !== null) {
      if (batteryValue >= 0 && batteryValue <= 25) {
        return 'red-fill';
      } else if (batteryValue <= 50) {
        return 'pink-fill'; // Replace with appropriate color class name
      } else if (batteryValue <= 75) {
        return 'lightgreen-fill';
      } else if (batteryValue <= 100) {
        return 'darkgreen-fill';
      }
    }
    return 'amber-fill'; // Default class for out-of-range values or if batteryValue is null
  };

  const fillColorClass = getFillColorClass(batteryValue);

  return (
    <svg width="200" height="150" strokeWidth="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" id="IconChangeColor">
      <path d="M21 2L20 3" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <path d="M3 2L4 3" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <path d="M21 16L20 15" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <path d="M3 16L4 15" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <path d="M9 18H15" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <path d="M10 21H14" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <path d="M11.9998 3C7.9997 3 5.95186 4.95029 5.99985 8C6.02324 9.48689 6.4997 10.5 7.49985 11.5C8.5 12.5 9 13 8.99985 15H14.9998C15 13.0001 15.5 12.5 16.4997 11.5001L16.4998 11.5C17.4997 10.5 17.9765 9.48689 17.9998 8C18.0478 4.95029 16 3 11.9998 3Z" stroke="#bb0068" strokeLinecap="round" strokeLinejoin="round" className={`fillTransition ${fillColorClass}`}></path>
      <filter id="shadow">
        <feDropShadow id="shadowValue" stdDeviation=".5" dx="0" dy="0" floodColor="black"></feDropShadow>
      </filter>
    </svg>
  );
};

export default LightBulb;
