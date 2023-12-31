import React, { useEffect, useState } from 'react';
import BatteryIcon from './components/BatterIcon';
import ModalSpinner from './components/ModalSpinner';

import { apiUrl } from './config';

interface PlantData {
  dailyOnGridEnergy: number;
  dailyOnGridEnergyUnit: string;
  dailyEnergyPurchased: number;
  dailyEnergyPurchasedUnit: string;
  energyToday: number;
  remainingCapacity: number;
  acPower: number;
}

interface InverterData {
  plant: PlantData[];
  login: boolean;
  timestamp: string;
}

const SolisInverterDetails: React.FC = () => {
  const [data, setData] = useState<InverterData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reloadPage = () => {
    window.location.reload(); // Reload the current page
  };

  useEffect(() => {
    // Schedule the page reload every 5 minutes (300,000 milliseconds)
    const interval = setInterval(reloadPage, 300000); // 5 minutes = 5 * 60 seconds * 1000 milliseconds

    // Clean up the interval when the component is unmounted
    return () => {
      console.log('** Page Refresh **')
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        fetch(apiUrl + '/pv')
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            // Process the fetched data
            const jsonData: InverterData = data;
            setData(jsonData);
            setIsLoading(false);
          })
          .catch((error) => {
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

  const parseDate = (inputDate: string): String => {
    const dateObj = new Date(inputDate);
    return dateObj.toLocaleDateString('en', {
      day: '2-digit',
      month: 'long',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="componentTop">
      <h2>Inverter Details - {data && parseDate(data.timestamp)}</h2>
      <table>
        <thead>
          <tr>
            <th>Remaining</th>
            <th>Current Power</th>
            <th>Exported</th>
            <th>Imported</th>
            <th>Generated</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.plant.map((plantData, index) => (
              <tr key={index}>
                <td className="cell">
                  <div className="batteryPercentage">
                    <BatteryIcon percent={plantData.remainingCapacity} />
                  </div>
                  <div className="fontSize18">{plantData.remainingCapacity}%</div>
                </td>
                <td>{convertToKilowattHours(plantData.acPower)} kWh</td>
                <td>
                  {plantData.dailyOnGridEnergy} {plantData.dailyOnGridEnergyUnit}
                </td>
                <td>
                  {plantData.dailyEnergyPurchased} {plantData.dailyEnergyPurchasedUnit}
                </td>
                <td>{plantData.energyToday} kWh</td>
              </tr>
            ))}
        </tbody>
      </table>
      <ModalSpinner loading={isLoading} />
    </div>
  );
};

export default SolisInverterDetails;
