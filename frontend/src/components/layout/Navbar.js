import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import logoImage from './../../assets/logo.png';
import './../../styles/layout.css'; 
import {Icon} from 'react-icons-kit';
import {ic_payments_outline} from 'react-icons-kit/md/ic_payments_outline';
import {ic_settings_outline} from 'react-icons-kit/md/ic_settings_outline';

function Navbar() {
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
    <header className="header">
      <Link to="/">
        <div className="logo-container">
            <img src={logoImage} alt="logo" className="logo" />
            <span className="logo-name">PCoin</span>
        </div>
      </Link>
      <div className="text-button-container">
        <Link to="/">
          <button className="nav-btn">Enter Minepool</button>
        </Link>
        <Link to="/transaction">
          <span className="nav-icon"><Icon icon={ic_payments_outline} size={30}/></span>
        </Link>
        <div className="menu-container">
          <span className={`nav-icon ${isMenuVisible ? "nav-icon-selected" : ""}`} onClick={toggleMenu}>
            <Icon icon={ic_settings_outline} size={30}/>
          </span>
          {isMenuVisible && 
            <div className="dropdown-menu">
                <div>Change Keys</div>
                <div>Change Password</div>
                <div onClick={handleLogout}>Logout</div>
            </div>
          }
        </div>
      </div>
    </header>
  );
}

export default Navbar;