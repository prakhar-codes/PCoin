import React, { useContext, useEffect } from 'react';
import Header from '../layout/Header';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <>
      <Header />
      <div>
        <h1>Home Page</h1>
        <p>Welcome to the Home Page!</p>
        <p>Click below to get started:</p>
        <p><Link to="/login">Login</Link></p>
        <p><Link to="/register">Register</Link></p>
      </div>
    </>
  );
}

export default Home;
