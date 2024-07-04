import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from './../../assets/logo.png';
import './../../styles/layout.css'; 

function Header({ headerText, buttonText, buttonLink }) {
  return (
    <header className="header">
      <Link to="/">
        <div className="logo-container">
            <img src={logoImage} alt="logo" className="logo" />
            <span className="logo-name">PCoin</span>
        </div>
      </Link>
      <div className="text-button-container">
        {headerText && <span className="header-text">{headerText}</span>}
        {buttonText && (
          <Link to={buttonLink}>
            <button className="header-btn">{buttonText}</button>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;