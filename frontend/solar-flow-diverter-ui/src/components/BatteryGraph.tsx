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
import { apiUrl } from '../config';
import SectionHeader from './SectionHeader';

const ALL_PV_ENDPOINT = '/all_pv';
const API_URL = `${apiUrl}${ALL_PV_ENDPOINT}`;

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
  scales: {
    y: {
      display: true,
      title: {
        display: true,
        text: 'Battery Percentage', 
      },
      min: 0, // Set the minimum value of x-axis
      max: 100, // Set the maximum value of x-axis
    },
  },
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: '',
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

  function getTime(dateString: string): string {
    const dateObject: Date = new Date(dateString);
    const formattedTime: string = `${dateObject.getHours()}:${String(dateObject.getMinutes()).padStart(2, '0')}`;
    return formattedTime;
  }

  const labels = chartData.map(entry => getTime(entry.timestamp));
  const remainingCapacityData = chartData.map(entry => entry.remainingCapacity)

  const updatedChartData = {
    labels,
    datasets: [
      {
        label: 'Battery',
        data: remainingCapacityData,
        borderColor: 'rgb(0, 121, 88)',
        backgroundColor: 'rgba(0, 121, 88, 0.5)',
      },
    ],
  };

  return( 
      <>
        <SectionHeader title="Battery Data"/>
        <Line options={options} data={updatedChartData} />
      </>
    )
}
