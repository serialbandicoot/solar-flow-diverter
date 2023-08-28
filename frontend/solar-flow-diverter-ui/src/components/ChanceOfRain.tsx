import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudShowersHeavy } from '@fortawesome/free-solid-svg-icons';

interface ChanceOfRainProps {
  percentage: string;
}

const ChanceOfRain: React.FC<ChanceOfRainProps> = ({ percentage }) => {
  const parsedPercentage = parseInt(percentage, 10);

  return (
    <div className="chance-of-rain">
      <FontAwesomeIcon icon={faCloudShowersHeavy} className="rain-icon" />
      <div className="rain-text">
        {parsedPercentage}% Rain
      </div>
    </div>
  );
};

export default ChanceOfRain;
