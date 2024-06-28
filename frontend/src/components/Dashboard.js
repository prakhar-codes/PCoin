import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    try {
      const response = await axios.post('http://localhost:5000/logout');

      if (response.status === 200) { 
        navigate('/');
      } else {
        setError(response.data || 'Logout failed. Please try again.');
      }
    } catch (error) {
      setError("An error occurred during logout.");
    }
  };

  return (
    <div>
      <h1>Welcome, {user ? user.username : 'Guest'}!</h1>
      <button onClick={handleLogout}>Logout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Dashboard;