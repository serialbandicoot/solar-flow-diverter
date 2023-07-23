import React from 'react';
import './index.css';
import SolisInverterDetails from './SolisInverterDetails';
import SevenDayForecast from './FiveDayForecast'; // Import the SevenDayForecast component

function App() {
  return (
    <div>
      <h1>Solar Flow Diverter</h1>
      <SolisInverterDetails />
      <SevenDayForecast /> 
    </div>
  );
}

export default App;
