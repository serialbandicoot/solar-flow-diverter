import React from 'react';

interface CompassProps {
  windDirection: string;
}

const Compass: React.FC<CompassProps> = ({ windDirection }) => {
  const windDirectionMap: { [key: string]: number } = {
    N: 0,
    NNE: 22.5,
    NE: 45,
    ENE: 67.5,
    E: 90,
    ESE: 112.5,
    SE: 135,
    SSE: 157.5,
    S: 180,
    SSW: 202.5,
    SW: 225,
    WSW: 247.5,
    W: 270,
    WNW: 292.5,
    NW: 315,
    NNW: 337.5
  };

  const arrowRotation = windDirectionMap[windDirection] || 0;

  const cardinalLabels = [
    { label: 'N', x: 50, y: 15, textAnchor: 'middle' },
    { label: 'S', x: 50, y: 85, textAnchor: 'middle' },
    { label: 'W', x: 15, y: 50, textAnchor: 'middle' },
    { label: 'E', x: 85, y: 50, textAnchor: 'middle' }
  ];

  return (
    <svg className="compass" viewBox="0 0 100 100">
      {/* Compass Circle */}
      <circle cx="50" cy="50" r="45" stroke="#444" strokeWidth="2" fill="none" />

      {/* Arrow */}
      <line
        x1="50"
        y1="50"
        x2="50"
        y2="10"
        stroke="#444"
        strokeWidth="3"
        transform={`rotate(${arrowRotation} 50 50)`}
      />

      {/* Cardinal Points */}
      {cardinalLabels.map(({ label, x, y, textAnchor }, index) => (
        <text
          key={index}
          x={x}
          y={y}
          textAnchor={textAnchor}
          alignmentBaseline="middle"
          fill="#444"
          fontWeight="bold"
        >
          {label}
        </text>
      ))}
    </svg>
  );
};

export default Compass;
