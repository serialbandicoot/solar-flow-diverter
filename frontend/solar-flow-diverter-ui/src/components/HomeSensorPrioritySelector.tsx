import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config';

const ACTIVATION_ENDPOINT = '/activation';
const API_URL = `${apiUrl}${ACTIVATION_ENDPOINT}`;

interface HomeSensorPriority {
  home_sensor: {
    priority: "battery" | "water_tank";
  };
}

const HomeSensorPrioritySelector: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<"battery" | "water_tank">('battery');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the current priority when the component mounts
    fetch(API_URL)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed');
        }
      })
      .then(data => {
        setSelectedPriority(data.home_sensor.priority);
      })
      .catch(error => {
        console.log(error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = event.target.value as "battery" | "water_tank";
    setSelectedPriority(newPriority);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
  
    const requestData: HomeSensorPriority = {
      home_sensor: {
        priority: selectedPriority,
      },
    };
  
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then(response => {
        if (response.ok) {
          // Handle success
          return response.json(); // Assuming the response body is JSON
        } else {
          throw new Error('Request failed');
        }
      })
      .catch(error => {
        console.log(error)
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };
  

  return (
    <div>
    <select
      id="prioritySelect"
      value={selectedPriority}
      onChange={handlePriorityChange}
      style={{ fontSize: '18px', padding: '5px', marginRight: '10px' }} // Adjust font size and spacing
    >
      <option value="battery">Battery</option>
      <option value="water_tank">Water Tank</option>
    </select>
    <button
  onClick={handleSubmit}
  disabled={isSubmitting}
  style={{
    fontSize: '18px',
    padding: '6px',
    color: 'white', // Set font color to white
    backgroundColor: '#F7AD40', // Set background color to #F7AD40
    border: 'none', // Remove border
    cursor: 'pointer', // Add pointer cursor
  }}
>
  {isSubmitting ? '...' : 'Submit'}
</button>

  </div>
  );
};

export default HomeSensorPrioritySelector;
