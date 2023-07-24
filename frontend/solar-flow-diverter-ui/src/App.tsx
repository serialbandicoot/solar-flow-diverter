import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SettingsScreen from './SettingsScreen'; 
import Home from './Home';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
