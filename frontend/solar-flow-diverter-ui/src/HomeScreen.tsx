import React from 'react';

import SolisInverterDetails from './SolisInverterDetails';
import FiveDayForecast from './FiveDayForecast'; 
import Header from './components/Header';
import MixergyTankData from './components/MixergyTankData';
import HomeSensor from './components/Notifications';
import SunriseSunset from './components/SunriseSunset';
import { BatteryGraph } from './components/BatteryGraph';

const HomeScreen: React.FC = () => {

  return (
    <div>
      <Header/>
      <SolisInverterDetails />
      <FiveDayForecast />
      <SunriseSunset />
      <MixergyTankData />
      <HomeSensor />
      <BatteryGraph />
    </div>
  );
};

export default HomeScreen;
