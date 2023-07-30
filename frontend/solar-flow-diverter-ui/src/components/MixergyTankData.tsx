import React from 'react';
import WaterTank from './WaterTank';
import Schedule from './Schedule';
import HomeSensor from './HomeSensor';

const MixergyTankData: React.FC = () => {
  return (
    <div>
      <h2 style={{ width: '100%', background: '#F7AD40', padding: '10px', margin: '0', color: 'white' }}>
        Mixergy Hot Water Tank
      </h2>
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <WaterTank />
        <Schedule />
        <HomeSensor />
      </div>
    </div>
  );
};

export default MixergyTankData;
