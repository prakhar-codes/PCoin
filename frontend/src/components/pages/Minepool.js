import React, { useState, useEffect, useContext, useRef } from 'react';
import MinepoolNavbar from '../layout/MinepoolNavbar';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './../../styles/minepool.css'; 
import './../../styles/dashboard.css'; 

const Minepool = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [verification, setVerification] = useState({});
    const [block, setBlock] = useState([]);
    const [blockchain, setBlockchain] = useState([]);
    const [showTransactions, setShowTransactions] = useState(true);
    const [showBlock, setShowBlock] = useState(false);
    const [showBlockchain, setShowBlockchain] = useState(false);
    const transactionsSectionRef = useRef(null);
    const blockSectionRef = useRef(null);
    const blockchainSectionRef = useRef(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }       
        const fetchTransactions = async () => {
            try {
                const response = await axios.get('http://localhost:5000/unconfirmed-transactions');
                if (response.status === 200) {
                    setTransactions(response.data);
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
        fetchTransactions();
    }, []);

    const toggleTransactions = () => {
        setShowTransactions(true);
        setShowBlock(false);
        setShowBlockchain(false);
        if (transactionsSectionRef.current) {
          transactionsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const toggleBlock = () => {
        setShowTransactions(false);
        setShowBlock(true);
        setShowBlockchain(false);
        if (blockSectionRef.current) {
          blockSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const toggleBlockchain = () => {   
        setShowTransactions(false);
        setShowBlock(false);
        setShowBlockchain(true);
        if (blockchainSectionRef.current) {
          blockchainSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const verifyTransaction = async (e, transaction) => {
        e.preventDefault();
        // Format is important
        var utxosList = [];
        transaction.utxos.forEach(utxo => {
            utxosList.push({ address: utxo.address, amount: parseFloat(utxo.amount) });
        });
        const transactionJSON = {
            inputAddress: transaction.input_address,
            inputAmount: parseFloat(transaction.input_amount),
            transactionFee: parseFloat(transaction.transaction_fee),
            utxos: utxosList
        };
        try {
          const response = await axios.post('http://localhost:5000/verify-transaction', {
            transaction: transactionJSON, 
            signature: transaction.signature,
            hash: transaction.hash
          });
    
          if (response.status === 200) {
            console.log(response.data);
            // verified or not verified
            setVerification(prevStatus => ({...prevStatus, [transaction.hash]: response.data.is_valid}));
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

    return (
        <>
            <MinepoolNavbar />
            <div className="minepool-body">
                <div className="minepool-container">
                    <div className="minepool-top">
                        <h1 className="minepool-welcome-message">Hey Miner, Welcome to Minepool!</h1>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    <div className="minepool-navbar">
                        <button className={`minepool-navbar-item ${showTransactions ? 'minepool-active' : ''}`} onClick={toggleTransactions}>All Transactions</button>
                        <button className={`minepool-navbar-item ${showBlock ? 'minepool-active' : ''}`} onClick={toggleBlock}>My Block</button>
                        <button className={`minepool-navbar-item ${showBlockchain ? 'minepool-active' : ''}`} onClick={toggleBlockchain}>Blockchain</button>
                    </div>
                    <div ref={transactionsSectionRef}>
                        {showTransactions && (
                            <>
                            <ul className="node-list">
                                {transactions.length === 0 && <li className="node-card">No transactions to show</li>}
                                {transactions.map((transaction, index) => (
                                    <li key={index} className="node-card">
                                    <div className="hash-container">
                                        <p>Transaction Hash : #<span className="hash">{transaction.hash}</span></p>
                                        <p>Timestamp : {transaction.timestamp}</p>
                                        <p>Pending</p>
                                    </div>
                                    <div className="tx-container">
                                        <li className="tx-card">
                                            <p>Transaction Fee</p>
                                            <p>Amount : {transaction.transaction_fee} PC</p>
                                        </li>
                                        <li className="tx-card">
                                            <p className='left'>Input : #<span className="hash">{transaction.input_address}</span></p>
                                            <p>Amount : {transaction.input_amount} PC</p>
                                        </li>
                                        {transaction.utxos.map((utxo, utxo_index) => (
                                        <li key={utxo_index} className="tx-card">
                                            <p className='left'>Output[{utxo_index}] : #<span className="hash">{utxo.address}</span></p>
                                            <p>Amount : {utxo.amount} PC</p>
                                        </li>
                                        ))}
                                    </div>
                                    <div className="pay-container">
                                    {verification[transaction.hash] === undefined ? (
                                        <button className="pay-button" onClick={(e) => verifyTransaction(e, transaction)}>Verify Transaction</button>
                                        ) : verification[transaction.hash] ? (
                                            <p>Transaction Verified</p>
                                        ) : (
                                            <p>Transaction Invalid</p>
                                        )}
                                        <button className="pay-button" onClick={() => console.log("hello")}>Add to Block</button>
                                    </div>
                                    </li>
                                ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Minepool;