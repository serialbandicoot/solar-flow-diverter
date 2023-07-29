import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa'; 

import SolisInverterDetails from './SolisInverterDetails';
import FiveDayForecast from './FiveDayForecast'; 
import Header from './components/Header';

const Home: React.FC = () => {

  return (
    <div>
      <Header/>
      <SolisInverterDetails />
      <FiveDayForecast />
    </div>
  );
};

export default Home;
