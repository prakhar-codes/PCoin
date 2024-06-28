import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from './AuthContext';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

const Register = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [icon, setIcon] = useState(eyeOff);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]+$/; // Only digits and alphabets
    return usernameRegex.test(username);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    // At least 8 characters, one letter, one number, and one special character
    return passwordRegex.test(password);
  };

  const handleToggle = () => {
    if (showPassword){
       setIcon(eyeOff);
       setShowPassword(false);
    } else {
       setIcon(eye);
       setShowPassword(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setValidationError(""); // Clear previous validation errors

    // Validate username and password
    if (!validateUsername(username)) {
      setValidationError(
        "Username should contain only letters and digits without spaces."
      );
      return;
    }

    if (!validatePassword(password)) {
      setValidationError(
        "Password must be at least 8 characters long, including a letter, a number, and a special character."
      );
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
      });
      if (response.status === 200) {
        navigate("/login");
      } else {
        setError(
          response.data.message || "Registration failed. Please try again."
        );
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

  return (
    <div className="login-container"> {/* Reuse the styling */}
      <h1 className="login-title">Register</h1>
      {validationError && <p className="login-error">{validationError}</p>}
      {error && <p className="login-error">{error}</p>}
      <form className="login-form" onSubmit={handleRegister}>
        <input
          className="login-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <button className="login-button" type="submit">Register</button>
      </form>
      <p className="login-register">Already have an account? <Link to="/login">Login here</Link></p>
    </div>
  );
};

export default Register;
