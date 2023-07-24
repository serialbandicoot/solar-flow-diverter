import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa'; 

import SolisInverterDetails from './SolisInverterDetails';
import FiveDayForecast from './FiveDayForecast'; 

const Home: React.FC = () => {
    
    const cogIconStyle = {
        fontSize: '50px', // Set the size to 30 pixels
        color: '#36454F', // Set the color to dark gray
    };

  return (
    <div>
      <div className="container">
        <h1>Solar Flow Diverter</h1>
        <Link to="/settings">
            <FaCog style={cogIconStyle}/>
      </Link>
      </div>
      <SolisInverterDetails />
      <FiveDayForecast />
    </div>
  );
};

export default Home;
