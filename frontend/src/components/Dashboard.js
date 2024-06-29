import React, { useState, useContext, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import Transaction from './Transaction'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);
  const [nodes, setNodes] = useState([]);
  const [selectedHash, setSelectedHash] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
    const fetchNodes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/nodes');
        if (response.status === 200) {
          setNodes(response.data);
        } else {
          setError(response.data || 'Login failed. Please try again.');
        }
      } catch (error) {
        if (error.response) {
          setError(`${error.response.data.message || "An error occurred"}`);
        } else if (error.request) {
          setError("No response from server. Please try again later.");
        } else {
          setError("Request error. Please try again.");
        }
      }
    };
    fetchNodes();
    }, [user, navigate]);

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
  };

  const handleHashClick = (hash) => {
    setSelectedHash(hash);
  };

  const handleTransactionComplete = () => {
    setSelectedHash(null); // Reset or fetch updated data
  };

  return (
    <div>
      <h1>Welcome, {user ? user.username : 'Guest'}!</h1>
      <p>Your hash is {user ? user.hash : 'undefined'}</p>
      {error && <p>{error}</p>}
      <ul>
        {nodes.map((node, index) => (
          <li key={index} onClick={() => handleHashClick(node.hash)}> Hash: {node.hash}</li>
        ))}
      </ul>
      <button onClick={handleLogout}>Logout</button>
      {selectedHash && <Transaction hashAddress={selectedHash} onTransactionComplete={handleTransactionComplete} />}
    </div>
  );
}

export default Dashboard;