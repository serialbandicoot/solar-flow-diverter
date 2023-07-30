import React from 'react';

import SolisInverterDetails from './SolisInverterDetails';
import FiveDayForecast from './FiveDayForecast'; 
import Header from './components/Header';
import MixergyTankData from './components/MixergyTankData';

const Home: React.FC = () => {

  return (
    <div>
      <Header/>
      <SolisInverterDetails />
      <FiveDayForecast />
      <MixergyTankData />
    </div>
  );
};

export default Home;
