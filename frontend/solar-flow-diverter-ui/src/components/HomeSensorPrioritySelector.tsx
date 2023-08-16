import React, { useState, useEffect } from 'react';
import { apiUrl } from '../config';

const ACTIVATION_ENDPOINT = '/priorities';
const API_URL = `${apiUrl}${ACTIVATION_ENDPOINT}`;

interface HomeSensorPriority {
  excess_priority: {
    order: 'battery' | 'water_tank';
    battery_threshold: number;
    water_threshold: number;
  };
}

const PrioritySelector: React.FC = () => {
  const [selectedPriority, setSelectedPriority] = useState<'battery' | 'water_tank'>('battery');
  const [batteryThreshold, setBatteryThreshold] = useState<GLfloat>(0);
  const [waterThreshold, setWaterThreshold] = useState<GLfloat>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the current priority and thresholds when the component mounts
    fetch(API_URL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed');
        }
      })
      .then((data) => {
        setSelectedPriority(data.excess_priority.order);
        setBatteryThreshold(data.excess_priority.battery_threshold);
        setWaterThreshold(data.excess_priority.water_threshold);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  const handlePriorityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPriority = event.target.value as 'battery' | 'water_tank';
    setSelectedPriority(newPriority);
  };

  const handleBatteryThresholdChange = (value: GLfloat) => {
    setBatteryThreshold(value);
  };

  const handleWaterThresholdChange = (value: GLfloat) => {
    setWaterThreshold(value);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    const requestData: HomeSensorPriority = {
      excess_priority: {
        order: selectedPriority,
        battery_threshold: batteryThreshold,
        water_threshold: waterThreshold,
      },
    };

    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => {
        if (response.ok) {
          // Handle success
          return response.json(); // Assuming the response body is JSON
        } else {
          throw new Error('Request failed');
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div>
      <div>
        <select
          id="prioritySelect"
          value={selectedPriority}
          onChange={handlePriorityChange}
          style={{ fontSize: '18px', padding: '5px', marginBottom: '10px', width: '125px' }}
        >
          <option value="battery">Battery</option>
          <option value="water_tank">Water Tank</option>
        </select>
      </div>
      <div>
        <input
          type="number"
          value={batteryThreshold}
          onChange={(e) => {
            const value = Math.min(100, parseFloat(e.target.value)); // Limit the value to a maximum of 100
            handleBatteryThresholdChange(value);
          }}
          step="0.01"
          placeholder="Battery Threshold"
          style={{
            fontSize: '18px',
            padding: '5px',
            width: '110px',
            marginBottom: '10px',
          }}
        />
        <span style={{ marginLeft: '5px' }}>% Battery Threshold</span>
      </div>
      <div>
        <div>
          <input
            type="number"
            value={waterThreshold}
            onChange={(e) => {
              const value = Math.min(100, parseFloat(e.target.value)); // Limit the value to a maximum of 100
              handleWaterThresholdChange(value);
            }}
            step="0.01"
            placeholder="Water Threshold"
            style={{
              fontSize: '18px',
              padding: '5px',
              width: '110px',
              marginBottom: '10px',
            }}
          />
          <span style={{ marginLeft: '5px' }}>% Water Threshold</span>
        </div>
      </div>
      <div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            fontSize: '18px',
            padding: '6px',
            color: 'white',
            backgroundColor: '#F7AD40',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isSubmitting ? '...' : 'Update'}
        </button>
      </div>
    </div>
  );
};

export default PrioritySelector;
