import React, { useEffect, useState } from 'react';
import BatteryIcon from './components/BatterIcon';
import ModalSpinner from './components/ModalSpinner';

interface InverterData {
  plant: {
    dailyOnGridEnergy: number;
    dailyOnGridEnergyUnit: string;
    dailyEnergyPurchased: number;
    dailyEnergyPurchasedUnit: string;
    energyToday: number;
    remainingCapacity: number;
    acPower: number; 
  };
  login: boolean;
}

const SolisInverterDetails: React.FC = () => {
  const [data, setData] = useState<InverterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch('http://localhost:5000/api/get_inverter_detail')
          .then(response => {
            return response.json();
          })
          .then(data => {
            // Process the fetched data
            const jsonData: InverterData = data;
            setData(jsonData);
            setIsLoading(false);
          })
          .catch(error => {
            console.log(error);
          });

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to convert watt-hours (Wh) to kilowatt-hours (kWh)
  const convertToKilowattHours = (wattHours: number): number => {
    return wattHours / 1000;
  };

  return (
    <div className="componentTop">
      <h2>Inverter Details</h2>
      <table>
        <thead>
          <tr>
            <th>Remaining Capacity</th>
            <th>Current Power</th>
            <th>Today Exported</th>
            <th>Today Imported</th>
            <th>Today Generated</th>
          </tr>
        </thead>
        <tbody>
          {data && (
            <tr>
              <td className="cell">
                <div className="batteryPercentage">
                  <BatteryIcon percent={data.plant.remainingCapacity} />
                </div>
                <div className="fontSize18">{data.plant.remainingCapacity}%</div>
              </td>
              <td>{convertToKilowattHours(data.plant.acPower)} kWh</td>
              <td>{data.plant.dailyOnGridEnergy} {data.plant.dailyOnGridEnergyUnit}</td>
              <td>{data.plant.dailyEnergyPurchased} {data.plant.dailyEnergyPurchasedUnit}</td>
              <td>{data.plant.energyToday} kWh</td>
            </tr>
          )}
        </tbody>
      </table>
      <ModalSpinner loading={isLoading} />
    </div>
  );
};

export default SolisInverterDetails;
