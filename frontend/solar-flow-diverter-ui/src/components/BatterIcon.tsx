import React from 'react';

interface BatteryIconProps {
  percent?: number; // Make the percentage prop optional
}

const BatteryIcon: React.FC<BatteryIconProps> = ({ percent = 0 }) => {
  // Ensure the percentage is within the range of 0 to 100
  const batteryPercent = Math.max(0, Math.min(100, percent));
  
  // Calculate the maximum height of the green fill to stay within the border
  const maxHeight = (36 * batteryPercent) / 100;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="40"
      viewBox="0 0 20 40"
      fill="none"
    >
      {/* Battery outline */}
      <rect width="18" height="37" x="1" y="2" stroke="black" strokeWidth="2" />
      {/* Battery fill based on percentage */}
      <rect
        width="16"
        height={maxHeight}
        x="2"
        y={40 - maxHeight - 2} // Subtract 2 to keep the fill within the border
        fill="#4CAF50" /* Green color for fill */
      />
    </svg>
  );
};

export default BatteryIcon;
