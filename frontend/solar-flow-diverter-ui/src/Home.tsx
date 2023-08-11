import React from 'react';

import SolisInverterDetails from './SolisInverterDetails';
import FiveDayForecast from './FiveDayForecast'; 
import Header from './components/Header';
import MixergyTankData from './components/MixergyTankData';
import HomeSensor from './components/HomeSensor';

const Home: React.FC = () => {

  return (
    <div>
      <Header/>
      <SolisInverterDetails />
      <FiveDayForecast />
      <MixergyTankData />
      <HomeSensor />
    </div>
  );
};

export default Home;
