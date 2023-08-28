import React from 'react';

interface TemperatureProps {
  temperature: string; // Changed to string
}

const Temperature: React.FC<TemperatureProps> = ({ temperature }) => {
  const parsedTemperature = parseInt(temperature, 10); // Parse the string to a number

  const temperatureBackgroundColor =
    parsedTemperature >= 20
      ? '#FF8C00' // Light Orange
      : parsedTemperature >= 15
      ? '#FFA500' // Yellow
      : parsedTemperature >= 10
      ? '#ADD8E6' // Light Blue
      : parsedTemperature >= 5
      ? '#0000FF' // Blue
      : '#00008B'; // Dark Blue

  return (
    <div className="centered-div" style={{ backgroundColor: temperatureBackgroundColor }}>
      {parsedTemperature}&deg;C
    </div>
  );
};

export default Temperature;
