/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import PaystackPayment from '@/components/PaystackPayment';
import { FaCoins, FaSpinner, FaEnvelope, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { recordTransactionOnChain } from '@/utils/contractInteractions';

const DashboardScreen: React.FC = () => {
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number>(4);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(120);
  const [email, setEmail] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          console.log('Wallet connected');
        }
      }
    };

    checkWalletConnection();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isWaiting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setIsWaiting(false);
      setTransactionSuccess(true);
      setShowNotification(true);
      setTimeout(() => {
        setTransactionSuccess(false);
        setShowNotification(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isWaiting, countdown]);

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful:', response);
    
    await recordTransactionOnChain(response.amount, response.currency);
    
    const amount = Number(response.amount) / 100;
    
    setTokenBalance(prevBalance => {
      const newBalance = prevBalance + amount;
      return Number(newBalance.toFixed(2));
    });
    setIsWaiting(true);
  };

  const handlePaymentClose = () => {
    console.log("Payment process closed.");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePayNowClick = () => {
    // Proceed with payment directly
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 min-h-screen text-slate-950">
      <Navbar authenticated />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-grey-400 to-black-600 mb-8"
        >
          Dashboard
        </motion.h1>
        
        <div className="grid md:grid-cols-1 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-200 rounded-lg shadow-lg p-6 border border-gray-300"
          >
            <div className="flex items-center mb-4">
              <FaCoins className="text-yellow-500 text-2xl mr-2" />
              <h2 className="text-xl font-semibold">Farcaster Account Fee</h2>
            </div>
            <p className="text-3xl font-bold text-yellow-400 mb-4">${(tokenBalance || 0).toFixed(2)}</p>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email for Farcaster Login</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handlePayNowClick}
            >
              
        <PaystackPayment
          email={email}
          amount={1}
          reference={`TRX-${new Date().getTime()}`}
          onSuccess={handlePaymentSuccess}
          onClose={handlePaymentClose}
        />
            </button>
          </motion.div>
        </div>

        <AnimatePresence>
          {isWaiting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
                <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-4">Processing Your Payment</h2>
                <p className="text-gray-600 mb-4">
                  Please wait while we confirm your transaction. This may take up to 2 minutes.
                </p>
                <p className="text-xl font-semibold">
                  Time remaining: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNotification && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-50"
            >
              <h3 className="text-lg font-bold mb-2">Transaction Complete!</h3>
              <p>Please check your email or Farcaster account to proceed with registration.</p>
              <button
                onClick={() => setShowNotification(false)}
                className="absolute top-2 right-2 text-white hover:text-gray-200"
              >
                <FaTimes />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
};

export default DashboardScreen;
