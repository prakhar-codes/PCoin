import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import axios from 'axios';
import './../../styles/dashboard.css'; 
import './../../styles/auth.css'; 
import { AuthContext } from '../contexts/AuthContext';
import { TransactionContext } from '../contexts/TransactionContext';
import {Icon} from 'react-icons-kit';  
import {ic_delete_outline} from 'react-icons-kit/md/ic_delete_outline';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye';
import {arrowRight} from 'react-icons-kit/feather/arrowRight';
import {arrowLeft} from 'react-icons-kit/feather/arrowLeft';

const Transaction = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { transactions, setTransactions } = useContext(TransactionContext);
  const [isPaymentsVisible, setIsPaymentsVisible] = useState(true);
  const [isCredentialsVisible, setIsCredentialsVisible] = useState(false);
  const [transactionFee, setTransactionFee] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [icon, setIcon] = useState(eyeOff);
  const [error, setError] = useState('');
  const [isPaymentDone, setIsPaymentDone] = useState(false);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isPaymentSuccessfull, setIsPaymentSuccessfull] = useState(false);

  const deletePayment = (id) => {
    const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
    setTransactions(updatedTransactions);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    var utxos = [], totalOutput = 0.0;
    transactions.forEach(transaction => {
      utxos.push({ address: transaction.hash, amount: transaction.amount });
      totalOutput += parseFloat(transaction.amount);
    });
    utxos.push({ address: user.hash, amount: 100.0-parseFloat(totalOutput)-parseFloat(transactionFee) });

    const transaction = {
        inputAddress: user.hash,
        inputAmount: 100.0, // user wallet balance according to verified transactions
        transactionFee: parseFloat(transactionFee?transactionFee:0.0),
        utxos: utxos
    };
    console.log(transaction);
    try {
      const response = await axios.post('http://localhost:5000/transaction', {
        transaction : transaction, 
        publicKey : user.publicKey, 
        privateKey : privateKey,
        username : user.username,
        password : password, 
        isUnauthorized : isUnauthorized
    });
      if (response.status === 200) {
        setTransactions([]);
        setTransactionFee('');
        setPrivateKey('');
        setPassword('');
        setIsCredentialsVisible(false);
        setIsPaymentDone(true);
        setIsPaymentSuccessfull(true);
      } else {
        setError('Transaction failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          setError('');
          setIsCredentialsVisible(false);
          setIsPaymentDone(true);
          setIsPaymentSuccessfull(false);
        }
        else if (error.response.status === 401) {
          setError('Wrong password. Please try again.');
        } else if (error.response.status === 403) {
          setError('Please enter a valid key.');
        }
        else setError(`${error.response.data.message || "An error occurred during the transaction."}`);
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Request error. Please try again.");
      }
    }
  };

  return (
    <>
    <Header/>
    {isPaymentsVisible && <div className="transaction-container">
      <h1>Added Payments</h1>
      <ul className="node-list">
        {transactions.length === 0 && <li className="node-card">No payments added yet</li>}
        {transactions.map((transaction, index) => (
          <li key={index} className="node-card">
            <div className="hash-container">
              <div>Pay To : <span className="hash">{transaction.hash}</span></div>
              <div>Amount : {transaction.amount} PC</div>
              <button className="icon-button" onClick={()=> deletePayment(transaction.id)}>
                <Icon icon={ic_delete_outline} size={25} />
              </button>
            </div>
          </li>
        ))}
        <li className="node-card">
          <div className='hash-container'>
            <div>Transaction Fee (Optional): </div>
            <input
              className="pay-amount"
              type="number"
              placeholder="Transaction Fee"
              value={transactionFee}
              onChange={(e) => setTransactionFee(e.target.value)}
              style={{width: '100px'}}
              />
          </div>
        </li>
      </ul>

      <button className="transaction-button" onClick={()=>navigate('/dashboard')}>
      <Icon icon={arrowLeft} size={18}/>  Back
      </button> 
      {transactions.length !==0 && <button className="transaction-button" onClick={()=>{setIsPaymentsVisible(false); setIsCredentialsVisible(true);}}>
        Next   <Icon icon={arrowRight} size={18}/>
      </button>}
    </div>}
    {isCredentialsVisible && <div className="auth-container">
      <h1 className="auth-title">Enter payment credentials</h1>
      {error && <p className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={handleSubmit}>
        <textarea
          className="key-input"
          value={privateKey}
          onChange={(e) => setPrivateKey(e.target.value)}
          placeholder="Private Key"
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
        <button className="transaction-button" onClick={()=>{setIsCredentialsVisible(false); setIsPaymentsVisible(true);}}>
        <Icon icon={arrowLeft} size={18}/>  Back
        </button> 
        <button className="transaction-button" type="submit">
          Done   <Icon icon={arrowRight} size={18}/>
        </button>
      </form>
    </div>}
    {isPaymentDone && <div className="auth-container">
      { isPaymentSuccessfull && 
        <>
          <h1>Payment Successfull</h1>
          <button className="transaction-button" onClick={()=>navigate('/dashboard')}>
            Go to Dashboard   <Icon icon={arrowRight} size={18}/>
          </button>
        </>
      }
      { !isPaymentSuccessfull && 
        <>
          <h1>Payment Unsuccessfull</h1>
          <p>Your keys didn't match. Do you still want to make the transaction?</p>
          <button className="transaction-button" onClick={()=>{setIsPaymentDone(false); setIsCredentialsVisible(true);}}>
          <Icon icon={arrowLeft} size={18}/>  No
          </button> 
          <button className="transaction-button" onClick={(e)=>{setIsUnauthorized(true); handleSubmit(e);}}>
            Yes   <Icon icon={arrowRight} size={18}/>
          </button>
        </>
      }
    </div>}
    </>
  );
};

export default Transaction;