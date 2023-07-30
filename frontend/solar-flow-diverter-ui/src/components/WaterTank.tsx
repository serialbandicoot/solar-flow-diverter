import React, { useEffect, useState } from 'react';
import { apiUrl } from '../config';


interface LatestMeasurementData {
  topTemperature: number;
  canTemperature: number;
  bottomTemperature: number;
}

const WaterTank: React.FC = () => {
  const [latestMeasurementData, setLatestMeasurementData] = useState<LatestMeasurementData | null>(null);

  useEffect(() => {
    async function fetchLatestMeasurementData() {
      try {
        const response = await fetch(`${apiUrl}/tank_latest_measurement`);
        const data = await response.json();
        setLatestMeasurementData(data);
      } catch (error) {
        console.error('Error fetching latest measurement data:', error);
      }
    }

    fetchLatestMeasurementData();
  }, []);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px', // Add a small top margin
  };


  const waterTankStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '10px', // Add a small top margin
    color: 'white', // Make the temperature text white
  };

  const tankStyle: React.CSSProperties = {
    position: 'relative',
    width: '100px',
    height: '200px',
    border: '2px solid #000',
    overflow: 'hidden',
    margin: '0',
  };

  const fluidStyle: React.CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '34%',
    background: '#F55312', // Red (top layer)
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    color: 'white', // Make the text white
  };

  const canFluidStyle: React.CSSProperties = {
    position: 'absolute',
    top: '34%',
    left: '0',
    width: '100%',
    height: '33%',
    background: '#F57111', // Orange (middle layer)
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    color: 'white', // Make the text white
  };

  const bottomFluidStyle: React.CSSProperties = {
    position: 'absolute',
    top: '67%',
    left: '0',
    width: '100%',
    height: '33%',
    background: '#317BD4', // Blue (bottom layer)
    display: 'flex',
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    color: 'white', // Make the text white
  };

  return (
    <div style={containerStyle}>
      <div style={waterTankStyle}>
        {/* Check if latestMeasurementData exists before rendering the WaterTank */}
        {latestMeasurementData && (
          <div className="tank" style={tankStyle}>
            <div className="fluid" style={fluidStyle}>
              {latestMeasurementData.topTemperature.toFixed(1)}
            </div>
            <div className="fluid" style={canFluidStyle}>
              {latestMeasurementData.canTemperature.toFixed(1)}
            </div>
            <div className="fluid" style={bottomFluidStyle}>
              {latestMeasurementData.bottomTemperature.toFixed(1)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaterTank;
