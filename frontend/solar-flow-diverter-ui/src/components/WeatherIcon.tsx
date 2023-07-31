import React, { useEffect, useState } from 'react';
import { ReactComponent as Icon0 } from './icons/0.svg';
import { ReactComponent as Icon1 } from './icons/1.svg';
import { ReactComponent as Icon2 } from './icons/2.svg';
import { ReactComponent as Icon3 } from './icons/3.svg';
import { ReactComponent as Icon7 } from './icons/7.svg';
import { ReactComponent as Icon8 } from './icons/8.svg';
import { ReactComponent as Icon9 } from './icons/9.svg';
import { ReactComponent as Icon10 } from './icons/10.svg';
import { ReactComponent as Icon12 } from './icons/12.svg';
import { ReactComponent as Icon13 } from './icons/13.svg';
import { ReactComponent as Icon14 } from './icons/14.svg';
import { ReactComponent as Icon15 } from './icons/15.svg';

interface WeatherIconProps {
  number: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ number }) => {
  const [icons, setIcons] = useState<{ [key: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> }>({});

  useEffect(() => {
    // Store imported SVG components in an object with keys as numbers
    const svgComponents = {
      '0': Icon0,
      '1': Icon1,
      '2': Icon2,
      '3': Icon3,
      '7': Icon7,
      '8': Icon8,
      '9': Icon9,
      '10': Icon10,
      '12': Icon12,
      '13': Icon13,
      '14': Icon14,
      '15': Icon15,
    };
    setIcons(svgComponents);
  }, []);

  const getIconByNumber = (number: string): React.FunctionComponent<React.SVGProps<SVGSVGElement>> | null => {
    // Check if the number exists as a key in the icons object
    if (icons.hasOwnProperty(number)) {
      return icons[number];
    }
    return null;
  };

  const IconComponent = getIconByNumber(number);

  return (
    <div>
      {IconComponent && <IconComponent width="100" height="100" />}
    </div>
  );
};

export default WeatherIcon;
