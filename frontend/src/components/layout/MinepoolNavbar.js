import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import logoImage from './../../assets/logo.png';
import './../../styles/minepool.css'; 
import {Icon} from 'react-icons-kit';
import {ic_settings_outline} from 'react-icons-kit/md/ic_settings_outline';

function MinepoolNavbar() {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuVisible(!isMenuVisible);
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <header className="minepool-header">
      <Link to="/">
        <div className="minepool-logo-container">
            <img src={logoImage} alt="minepool-logo" className="minepool-logo" />
            <div className="minepool-logo-name">PCoin</div>
            <span className="minepool-logo-name minepool">Minepool</span>
        </div>
      </Link>
      <div className="minepool-header-text-container">
        <Link to="/">
        <span className="minepool-header-text">Back To Dashboard</span>
        </Link>
        <div className="menu-container">
          <span className={`nav-icon ${isMenuVisible ? "nav-icon-selected" : ""}`} onClick={toggleMenu}>
            <Icon icon={ic_settings_outline} size={30}/>
          </span>
          {isMenuVisible && 
            <div className="dropdown-menu">
                <div onClick={handleLogout}>Logout</div>
            </div>
          }
        </div>
      </div>
    </header>
  );
}

export default MinepoolNavbar;