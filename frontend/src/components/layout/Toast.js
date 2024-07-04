import React, { useState, useEffect } from 'react';
import './../../styles/layout.css';
import { Icon } from 'react-icons-kit';
import {ic_info_outline} from 'react-icons-kit/md/ic_info_outline'

const Toast = ({ message, color }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`toast fade-out`} style={{ backgroundColor: color }}>
      <Icon icon={ic_info_outline} size={20} style={{ marginRight: '10px', marginBottom: '2px' }} />
      {message}
    </div>
  );
};

export default Toast;