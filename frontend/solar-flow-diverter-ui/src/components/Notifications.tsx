import React, { useEffect, useState } from 'react';
import SectionHeader from './SectionHeader';
import { apiUrl } from '../config';

const NOTIFICATION_ENDPOINT = '/notifications';
const API_URL = `${apiUrl}${NOTIFICATION_ENDPOINT}`;

interface Notification {
  battery: boolean;
  water_tank: boolean;
  grid: boolean;
}

interface NotificationData {
  notifications: Notification;
  timestamp: string;
}

const Notifications: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    marginTop: '20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
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
    fontSize: '64px',
    cursor: 'pointer',
    outline: 'none',
  };

  const [isBatteryClicked, setIsBatteryClicked] = useState(false);
  const [isWaterTankClicked, setIsWaterTankClicked] = useState(false);
  const [isGridClicked, setIsGridClicked] = useState(false);

  const handleBatteryClick = async () => {
    handleClick("battery");
  };
  
  const handleWaterTankClick = async () => {
    handleClick("water_tank");
  };
  
  const handleGridClick = async () => {
    handleClick("grid");
  };

  const handleClick = async (componentType: string) => {
    let notify;
    switch (componentType) {
      case 'battery':
        setIsBatteryClicked((prevState) => !prevState);
        notify = !isBatteryClicked;
        break;
      case 'water_tank':
        setIsWaterTankClicked((prevState) => !prevState);
        notify = !isWaterTankClicked;
        break;
      case 'grid':
        setIsGridClicked((prevState) => !prevState);
        notify = !isGridClicked;
        break;
      default:
        console.error('Unknown componentType:', componentType);
        return;
    }
  
    const notificationType = componentType;
    const notificationValue = notify;

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notification_type: notificationType,
          notification_value: notificationValue,
        }),
      });

      if (response.ok) {
        console.log('Notification sent successfully.');
      } else {
        console.error('Failed to send notification.');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }

    // Use the 'activation' variable as needed for further logic
  };

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.notifications) {
          const notify: NotificationData = data;
          setIsBatteryClicked(notify.notifications.battery);
          setIsWaterTankClicked(notify.notifications.water_tank);
          setIsGridClicked(notify.notifications.grid);
        }
      })
      .catch((error) => {
        console.error('Error fetching sensor data:', error);
      });
  }, []);

  return (
    <div>
      <SectionHeader title="Notifications" />
      <div style={containerStyle}>
        <button
          style={{
            ...buttonStyle,
            background: isBatteryClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleBatteryClick}
        >
          🔋
        </button>
        <button
          style={{
            ...buttonStyle,
            background: isWaterTankClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleWaterTankClick}
        >
          🚰
        </button>
        <button
          style={{
            ...buttonStyle,
            background: isGridClicked ? '#F7AD40' : 'transparent',
          }}
          onClick={handleGridClick}
        >
          🏭
        </button>
      </div>
    </div>
  );
};

export default Notifications;
