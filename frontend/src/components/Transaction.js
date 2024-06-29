import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const Transaction = ({ hashAddress, onTransactionComplete }) => {
  const { user } = useContext(AuthContext);
  const [amount, setAmount] = useState('');
  const [transactionFee, setTransactionFee] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const transaction = {
        inputAddress: user.hash,
        inputAmount: 100.0,
        transactionFee: parseFloat(transactionFee),
        privateKey: privateKey,
        utxos: [
            { address: user.hash, amount: 100.0-parseFloat(amount)-parseFloat(transactionFee)},
            { address: hashAddress, amount: amount }
        ]
    };
    try {
      const response = await axios.post('http://localhost:5000/transaction', {
        transaction : transaction, 
        publicKey : user.publicKey, 
        privateKey : privateKey
    });
      if (response.status === 200) {
        onTransactionComplete();
      } else {
        setError('Transaction failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        setError(`${error.response.data.message || "An error occurred during the transaction."}`);
      } else if (error.request) {
        setError("No response from server. Please try again later.");
      } else {
        setError("Request error. Please try again.");
      }
    }
  };

  return (
    <div>
      <h2>Transaction for Hash: {hashAddress}</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="transactionFee">Transaction Fee:</label>
          <input
            type="number"
            id="transactionFee"
            value={transactionFee}
            onChange={(e) => setTransactionFee(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="privateKey">Private Key:</label>
          <input
            type="text"
            id="privateKey"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit Transaction</button>
      </form>
    </div>
  );
};

export default Transaction;