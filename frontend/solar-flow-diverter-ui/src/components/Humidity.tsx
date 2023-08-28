import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTint } from '@fortawesome/free-solid-svg-icons'; // Water droplet icon

interface HumidityProps {
  humidity: string;
}

const Humidity: React.FC<HumidityProps> = ({ humidity }) => {
  const parsedHumidity = parseInt(humidity, 10);

  return (
    <div className="humidity">
      <FontAwesomeIcon icon={faTint} className="humidity-icon" />
      <div className="humidity-text">
        {parsedHumidity}% 
      </div>
    </div>
  );
};

export default Humidity;
