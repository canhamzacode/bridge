import React, { useState, useEffect } from 'react';
import { getUserTransactions } from '../utils/contractInteractions';

interface Transaction {
  amount: string | number;
  currency: string;
  timestamp: Date;
}

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const userTransactions = await getUserTransactions(accounts[0]);
          setTransactions(userTransactions);
        }
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transaction History</h2>
      <ul>
        {transactions.map((tx, index) => (
          <li key={index}>
            Amount: {tx.amount}, Currency: {tx.currency}, Date: {tx.timestamp.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionHistory;
