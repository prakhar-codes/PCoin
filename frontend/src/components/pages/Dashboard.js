import React, { useState, useContext, useEffect } from 'react';
import Navbar from '../layout/Navbar';
import Toast  from '../layout/Toast';
import axios from "axios";
import './../../styles/dashboard.css'; 
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { TransactionContext } from '../contexts/TransactionContext';
import {Icon} from 'react-icons-kit';
import {ic_content_copy} from 'react-icons-kit/md/ic_content_copy';
import {plus} from 'react-icons-kit/iconic/plus'

const Dashboard = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const [nodes, setNodes] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const { transactions, setTransactions } = useContext(TransactionContext);
  const [showNetwork, setShowNetwork] = useState(true);
  const [showTransactions, setShowTransactions] = useState(false);
  const [id, setId] = useState(0);
  const [toast, setToast] = useState();
  const [toastKey, setToastKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNodes = nodes.filter(node => node.hash.includes(searchQuery));

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
    const fetchMyTransactions = async () => {
      try {
        const response = await axios.post('http://localhost:5000/my-transactions', { hash: user.hash });
        if (response.status === 200) {
          console.log(response.data);
          setCompletedTransactions(response.data);
        } else {
          setError(response.data || 'Failed to fetch transactions. Please try again.');
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
    fetchMyTransactions();
    }, [user, navigate]);

    const toggleNetwork = () => {
        setShowNetwork(true);
        setShowTransactions(false);
    };

    const toggleTransactions = () => {
        setShowTransactions(true);
        setShowNetwork(false);
    };

  const copyToClipboard = () => {
    if (user && user.hash) {
      navigator.clipboard.writeText(user.hash)
        .then(() => {
          setToastKey(prevKey => prevKey + 1);
          setToast({message: 'Hash copied to clipboard', color: 'green'});
        })
        .catch(err => {
          setToastKey(prevKey => prevKey + 1);
          setToast({message: 'Error copying to clipboard', color: 'red'});
        });
    }
  };

  const handlePayButtonClick = (nodeHash) => {
    const updatedNodes = nodes.map(node => {
      if (node.hash === nodeHash) {
        return {
          ...node,
          showInput: !node.showInput,
          buttonText: node.showInput ? "Pay to hash" : "Cancel"
        };
      }
      return node;
    });
    setNodes(updatedNodes);
  };

  const handleAddButtonClick = (node) => {
    setId(id + 1);
    const newTransaction = { id: id, hash: node.hash, amount: node.amount };
    setTransactions([...transactions, newTransaction]);
    setToastKey(prevKey => prevKey + 1);
    setToast({message: 'Transaction added to PVault', color: 'green'});
    node.buttonText = "Pay to hash";
    node.amount = "";
    node.showInput = false;
  };

  const handleInputChange = (index, e) => {
    const updatedNodes = nodes.map((n, ni) => {
      if (ni === index) return { ...n, amount: e.target.value };
      return n;
    });
    setNodes(updatedNodes);
  }

  return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <h1 className="welcome-message">Welcome, {user ? user.username : 'Guest'}!</h1>
          <p>Your hash : #<span className='hash'>{user ? user.hash : 'undefined'} </span>
            <button onClick={copyToClipboard} className="icon-button">
              <Icon icon={ic_content_copy} size={20}/>
            </button>
          </p>
          <p>Wallet Balance : 100.00 PC</p>
          {error && <p className="error-message">{error}</p>}
          <div className="navbar">
              <button className={`navbar-item ${showNetwork ? 'active' : ''}`} onClick={toggleNetwork}>My Network</button>
              <button className={`navbar-item ${showTransactions ? 'active' : ''}`} onClick={toggleTransactions}>My Transactions</button>
          </div>
          {showNetwork && (
            <>
            <div className="searchbar">
              <input
                type="text"
                placeholder="Search for a hash address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <ul className="node-list">
              {filteredNodes.map((node, index) => (
                node.hash !== user.hash && 
                <li key={index} className="node-card">
                  <div className="hash-container">
                    <p>User Hash : #<span className="hash">{node.hash}</span></p>
                    <button className="pay-button" onClick={() => handlePayButtonClick(node.hash)}>{node.buttonText || "Pay to hash"}</button>
                  </div>
                  {node.showInput &&
                    <div className="pay-container">
                      <input type="number" className="pay-amount" placeholder="Enter amount" value={node.amount} onChange={(e) => handleInputChange(index, e)}/>
                      <span className="PC">PC   </span>
                      <button className="pay-button" onClick={() => handleAddButtonClick(node)}><Icon icon={plus} size={12} /> Add to PVault</button>
                    </div>
                  }
                </li>
              ))}
            </ul>
            </>
          )}
          {showTransactions && (
            <ul className="node-list">
              {completedTransactions.length === 0 && <li className="node-card">No transactions to show</li>}
              {completedTransactions.map((transaction, index) => (
                <li key={index} className="node-card">
                  <div className="hash-container">
                    <p>Transaction Hash : #<span className="hash">{transaction.hash}</span></p>
                    <p>Timestamp : {transaction.timestamp}</p>
                    <p>Pending</p>
                  </div>
                  <div className="tx-container">
                    {transaction.utxos.map((utxo, utxo_index) => ( utxo.address != user.hash &&
                      <li key={utxo_index} className="tx-card">
                        <p className='left'>To : #<span className="hash">{utxo.address}</span></p>
                        <p>Amount : {utxo.amount} PC</p>
                      </li>
                    ))}
                    <li className="tx-card">
                      <p>Transaction Fee</p>
                      <p>Amount : {transaction.transaction_fee} PC</p>
                    </li>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {toastKey > 0 && <Toast key={toastKey} message={toast.message} color={toast.color} />}
      </>
    );
}

export default Dashboard;