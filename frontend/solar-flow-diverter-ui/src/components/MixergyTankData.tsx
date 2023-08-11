import React from 'react';
import WaterTank from './WaterTank';
import Schedule from './Schedule';
import SectionHeader from './SectionHeader';

const MixergyTankData: React.FC = () => {
  return (
    <div>
      <SectionHeader title="Mixergy Water Tank" />
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <WaterTank />
        <Schedule />
      </div>
    </div>
  );
};

export default MixergyTankData;
