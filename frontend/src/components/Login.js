import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import '../App.css';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [identifier, setIdentifier] = useState(''); 
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [icon, setIcon] = useState(eyeOff);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/login', {
        identifier,
        password
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        login(access_token);
        navigate('/dashboard');
      } else {
        setError(response.data || 'Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a code greater than 2xx
        setError(`${error.response.data.message || "An error occurred"}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError("No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError("Request error. Please try again.");
      }
    }
  };

  const handleToggle = () => {
    if (showPassword){
       setIcon(eyeOff);
       setShowPassword(false);
    } else {
       setIcon(eye);
       setShowPassword(true);
    }
 }

  return (
    <div className="login-container">
      <h1 className="login-title">Login</h1>
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="text"
          placeholder="Email or Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <div className="password-wrapper">
          <input
            className="login-input"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span onClick={handleToggle} className="password-icon">
            <Icon icon={icon} size={20}/>
          </span>
         </div> 
        <button className="login-button" type="submit">Login</button>
      </form>
      <p className="login-register">Don't have an account? <Link to="/register">Register here</Link></p>
    </div>
  );
}

export default Login;