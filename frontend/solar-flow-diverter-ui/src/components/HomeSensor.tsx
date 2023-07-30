import React, { useState } from 'react';

const HomeSensor: React.FC = () => {
  const containerStyle: React.CSSProperties = {
    marginLeft: '20px',
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

  const handleHouseClick = () => {
    setIsHouseClicked((prevState) => !prevState); // Toggle the state
  };

  const handleTapClick = () => {
    setIsTapClicked((prevState) => !prevState); // Toggle the state
  };

  const handleBathClick = () => {
    setIsBathClicked((prevState) => !prevState); // Toggle the state
  };

  const handleOnButtonClick = () => {
    setIsOnButtonClicked((prevState) => !prevState); // Toggle the state
  };

  return (
    <div style={containerStyle}>
      <button
        style={{
          ...buttonStyle,
          background: isHouseClicked ? '#F7AD40' : 'transparent',
        }}
        onClick={handleHouseClick}
      >
        🏠
      </button>
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
      <button
        style={{
          ...buttonStyle,
          background: isOnButtonClicked ? '#F7AD40' : 'transparent',
        }}
        onClick={handleOnButtonClick}
      >
        🔘
      </button>
    </div>
  );
};

export default HomeSensor;
