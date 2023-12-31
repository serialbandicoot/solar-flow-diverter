import React from 'react';

import SolisInverterDetails from './SolisInverterDetails';
import FiveDayForecast from './components/FiveDayForecast'; 
import Header from './components/Header';
import MixergyTankData from './components/MixergyTankData';
import HomeSensor from './components/Notifications';
import SunriseSunset from './components/SunriseSunset';
import { BatteryGraph } from './components/BatteryGraph';
import Notifications from './components/Notifications';
import ThreeHourlyForecast from './components/ThreeHourlyForecast';

const HomeScreen: React.FC = () => {

  return (
    <div>
      <Header/>
      <SolisInverterDetails />
      <ThreeHourlyForecast />
      <FiveDayForecast />
      <SunriseSunset />
      <MixergyTankData />
      <Notifications />
      <BatteryGraph />
    </div>
  );
};

export default HomeScreen;
