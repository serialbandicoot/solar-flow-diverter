import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { apiUrl } from '../config';

const ALL_PV_ENDPOINT = '/all_pv';
const API_URL = `${apiUrl}${ALL_PV_ENDPOINT}`;

ChartJS.register(
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  scales: {
    x: {
      beginAtZero: true,
      max: 100,
    },
  },
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
        const response = await fetch(API_URL);
        const fetchedData: ChartData[] = await response.json();
        setChartData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    fetchData();
  }, []);

  const labels = chartData.map((_entry, index) => index * 100 / (chartData.length - 1));
  const remainingCapacityData = chartData.map(entry => entry.remainingCapacity);
  console.log(remainingCapacityData, labels)

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
