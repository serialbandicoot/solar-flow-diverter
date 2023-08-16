// Header.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendar, FaCog } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="header-container">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <img src="/light_icon.svg" alt="Icon" width={60} style={{ paddingLeft: '20px' }} />
      </Link>
      <Link to="/" className="home-link"> {/* Make the "Solar Flow Diverter" text a link */}
        <h1>Solar Flow Diverter</h1>
      </Link>
      <div className="icon-container">
      <Link to="/schedule" className="schedule-link">
          <FaCalendar className="fa-icon" />
      </Link>
      <Link to="/settings" className="settings-link">
          <FaCog className="fa-icon" />        
      </Link>
      </div>
    </header>
  );
};

export default Header;
