import React, { useEffect, useState } from 'react';
import { apiUrl } from '../config';
import SectionHeader from './SectionHeader';

const ACTIVATION_ENDPOINT = '/activation';
const API_URL = `${apiUrl}${ACTIVATION_ENDPOINT}`;

const HomeSensor: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gridGap: '10px',
    flex: 1,
  };

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    fontSize: '64px', // Make the icons 4 times bigger
    cursor: 'pointer', // Show pointer cursor on hover
    outline: 'none', // Remove default focus outline
  };

  const [isHouseClicked, setIsHouseClicked] = useState(false);
  const [isTapClicked, setIsTapClicked] = useState(false);
  const [isBathClicked, setIsBathClicked] = useState(false);
  const [isOnButtonClicked, setIsOnButtonClicked] = useState(false);

  interface HomeSensorData {
    home_sensor: {
      bath: boolean;
      heating: boolean;
      home: boolean;
      water: boolean;
      priority: string;
    };
    timestamp: string;
  }

  // Function to fetch data from the API and update the component state
  const fetchSensorData = () => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.home_sensor) {
          const hmData: HomeSensorData = data;
          setIsHouseClicked(hmData.home_sensor.home)
          setIsTapClicked(hmData.home_sensor.water)
          setIsBathClicked(hmData.home_sensor.bath)
          setIsOnButtonClicked(hmData.home_sensor.heating)
        }
      })
      .catch((error) => {
        console.error('Error fetching sensor data:', error);
      });
  };

  // useEffect hook to fetch initial data on component mount
  useEffect(() => {
    fetchSensorData();
  }, );

  const handleHouseClick = () => {
    handleClick("home")
  };

  const handleTapClick = () => {
    handleClick("water")
  };

  const handleBathClick = () => {
    handleClick("bath")
  };

  const handleOnButtonClick = () => {
    handleClick("heating")
  };

  const handleClick = (sensorType: string) => {
    let activation;
    switch (sensorType) {
      case 'bath':
        setIsBathClicked((prevState) => !prevState);
        activation = !isBathClicked;
        break;
      case 'home':
        setIsHouseClicked((prevState) => !prevState);
        activation = !isHouseClicked;
        break;
      case 'water':
        setIsTapClicked((prevState) => !prevState);
        activation = !isTapClicked;
        break;
      case 'heating':
        setIsOnButtonClicked((prevState) => !prevState);
        activation = !isOnButtonClicked;
        break;
      default:
        // Handle unexpected sensorType value (optional)
        console.error('Unknown sensorType:', sensorType);
        return;
    }
    
    // Send POST request to the API endpoint
    fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activate: activation,
        type: sensorType
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Message sent:', data);
        // You can handle the response here if needed
      })
      .catch((error) => {
        console.error('Error sending message:', error);
      });
  };

  return (
    <div>
      <SectionHeader title="Notifications" />
      <div style={containerStyle}>
        {/* <button
          style={{
            ...buttonStyle,
            background: isHouseClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleHouseClick}
        >
          🏠
        </button> */}
        <button
          style={{
            ...buttonStyle,
            background: isTapClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleTapClick}
        >
          🚰
        </button>
        <button
          style={{
            ...buttonStyle,
            background: isBathClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleBathClick}
        >
          🛁
        </button>
        {/* <button
          style={{
            ...buttonStyle,
            background: isOnButtonClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleOnButtonClick}
        >
          🔘
        </button> */}
      </div>
    </div>
  );
};

export default HomeSensor;
