// Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaCog } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <img src="/light_icon.svg" alt="Icon" width={50} style={{ paddingLeft: '20px' }} />
      </Link>
      <Link to="/" className="home-link"> {/* Make the "Solar Flow Diverter" text a link */}
        <h1>Solar Flow Diverter</h1>
      </Link>
      <Link to="/settings" className="settings-link">
        <div className="cog-icon-container">
          <FaCog className="cog-icon" />
        </div>
      </Link>
    </header>
  );
};

export default Header;
