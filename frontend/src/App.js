import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/contexts/AuthContext';
import { TransactionProvider } from './components/contexts/TransactionContext';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Dashboard from './components/pages/Dashboard';
import Transaction from './components/pages/Transaction';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <TransactionProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home/>} exact/>
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/transaction" element={<Transaction/>} /> 
          </Routes>
        </div>
      </TransactionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
