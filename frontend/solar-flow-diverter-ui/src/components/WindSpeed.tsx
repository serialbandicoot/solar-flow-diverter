import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWind } from '@fortawesome/free-solid-svg-icons';

interface WindSpeedProps {
  windSpeed: string;
}

const WindSpeed: React.FC<WindSpeedProps> = ({ windSpeed }) => {
  const parsedWindSpeed = parseInt(windSpeed, 10);

  return (
    <div className="wind-speed">
      <FontAwesomeIcon icon={faWind} className="wind-icon" />
      <div className="wind-text">
        {parsedWindSpeed} mph
      </div>
    </div>
  );
};

export default WindSpeed;
