import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SettingsScreen from './SettingsScreen'; 
import HomeScreen from './HomeScreen';
import ScheduleScreen from './ScheduleScreen';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/schedule" element={<ScheduleScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
