import React, { useState, useEffect, useContext } from 'react';
import Header from '../layout/Header';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import './../../styles/auth.css';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'
import {ic_login} from 'react-icons-kit/md/ic_login'

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
    <>
      <Header headerText={"Don't have an account?"} buttonText={"Register Here"} buttonLink={"/register"} />
      <div className="auth-container">
        <h1 className="auth-title">Login</h1>
        {error && <p className="auth-error">{error}</p>}
        <form className="auth-form" onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
          <div className="password-wrapper">
            <input
              className="auth-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={handleToggle} className="password-icon">
              <Icon icon={icon} size={18}/>
            </span>
          </div> 
          <button className="auth-button" type="submit">Login  <Icon icon={ic_login} size={20}/></button>
        </form>
      </div>
    </>
  );
}

export default Login;