import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/subadmin/transactions');
        setTransactions(data);
      } catch (error) {
        console.error('Failed to fetch transactions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      {loading ? <p>Loading...</p> : (
        transactions.map((txn) => (
          <div key={txn.id}>
            <p>Transaction ID: {txn.id}</p>
            <p>Status: {txn.status}</p>
            <p>Amount: {txn.amount}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Transactions;
