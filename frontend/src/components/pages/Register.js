import React, { useState, useEffect, useContext } from "react";
import Header from '../layout/Header';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../contexts/AuthContext';
import './../../styles/auth.css';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import {key} from 'react-icons-kit/iconic/key';
import {arrowRight} from 'react-icons-kit/feather/arrowRight';
import {tick} from 'react-icons-kit/typicons/tick'
import { ec as EC } from 'elliptic';

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
  const [showCredentials, setShowCredentials] = useState(true);
  const [showKeys, setShowKeys] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

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

  const handleAddKeys = async(e) => {
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
    setShowCredentials(false);
    handleGenerateKey();
    setShowKeys(true);
  };

  const handleGenerateKey = () => {
    const ec = new EC('secp256k1');
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
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
    try {
      const response = await axios.post("http://localhost:5000/register", {
        username,
        email,
        password,
        publicKey
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
    <>
      <Header headerText={"Already have an account?"} buttonText={"Login Here"} buttonLink={"/login"} />
      <div className="auth-container"> 
        {showCredentials && (
          <>
            <h1 className="auth-title">Register</h1>
            {validationError && <p className="auth-error">{validationError}</p>}
            {error && <p className="auth-error">{error}</p>}
            <form className="auth-form" onSubmit={handleAddKeys}>
              <input
                className="auth-input"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <input
                className="auth-input"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <button className="auth-button" type="submit">Next     <Icon icon={arrowRight} size={18}/></button>
            </form>
          </>
        )}
        {showKeys && (
          <>
          <h1 className="auth-title">Set Key Pair</h1>
          <form className="auth-form" onSubmit={handleRegister}>
            <p className="auth-error">Save the private key in a secure place. You will not be able to recover it as it will not be communicated to the server.</p>
            <p className="auth-heading">Private Key:</p>
            <textarea
              className="key-input"
              value={privateKey}
              readOnly
            />
            <p className="auth-heading">Public Key:</p>
            <textarea
              className="key-input-public"
              value={publicKey}
              readOnly
            />
            <button onClick={handleGenerateKey} type="button" className="generate-button">
              Generate Keys Again   <Icon icon={key} size={14}/>
            </button> 
            <button className="auth-button" type="submit">
              Register   <Icon icon={tick} size={20}/>
            </button>
          </form>
          </>
        )}
      </div>
    </>
  );
};

export default Register;
