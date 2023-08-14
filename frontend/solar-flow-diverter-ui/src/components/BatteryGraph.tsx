import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

interface ChartData {
  timestamp: string;
  remainingCapacity: number;
  // Add more properties if needed
}

export function BatteryGraph() {
  const initialChartData: ChartData[] = [];
  const [chartData, setChartData] = useState(initialChartData);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/v1/all_pv');
        const fetchedData: ChartData[] = await response.json();
        setChartData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchData();
  }, []);

  const labels = chartData.map(entry => entry.timestamp);
  const remainingCapacityData = chartData.map(entry => entry.remainingCapacity);

  const updatedChartData = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: remainingCapacityData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return <Line options={options} data={updatedChartData} />;
}
