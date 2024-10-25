/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import PaystackPayment from '@/components/PaystackPayment';
import { FaCoins, FaSpinner, FaEnvelope, FaTimes, FaCreditCard, FaBitcoin } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { recordTransactionOnChain } from '@/utils/contractInteractions';
import { Checkout, CheckoutButton, CheckoutStatus } from '@coinbase/onchainkit/checkout';
import { LifecycleStatus } from '@coinbase/onchainkit/transaction';

const DashboardScreen: React.FC = () => {
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [tokenBalance, setTokenBalance] = useState<number>(4);
  const [isWaiting, setIsWaiting] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(120);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'paystack' | 'coinbase' | null>(null);

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
    setSelectedPaymentMethod(null);
  };

  const statusHandler = async (status: LifecycleStatus) => {
    const { statusName, statusData } = status;
    switch (statusName) {
      case 'success':
        console.log('Checkout successful:', statusData);
        break;
      case 'init':
      case 'transactionIdle':
      case 'transactionPending':
      case 'transactionLegacyExecuted':
        console.log('Payment status:', statusName);
        break;
      case 'error':
        console.error('Checkout error');
        break;
      default:
        console.log('Checkout initialized');
    }
  };

  const PaymentOption: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    selected: boolean;
  }> = ({ icon, title, description, onClick, selected }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`bg-white rounded-lg shadow-md p-6 cursor-pointer ${
        selected ? 'border-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          Farcaster Account Dashboard
        </motion.h1>
        
        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaCoins className="text-yellow-500 text-3xl mr-3" />
              <h2 className="text-2xl font-semibold">Account Balance</h2>
            </div>
            <p className="text-4xl font-bold text-blue-600">${(tokenBalance || 0).toFixed(2)}</p>
          </div>
          
          <h3 className="text-xl font-semibold mb-4">Select Payment Method</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <PaymentOption
              icon={<FaCreditCard className="text-blue-500 text-2xl" />}
              title="Pay with Card"
              description="Secure payment via Paystack"
              onClick={() => setSelectedPaymentMethod('paystack')}
              selected={selectedPaymentMethod === 'paystack'}
            />
            <PaymentOption
              icon={<FaBitcoin className="text-orange-500 text-2xl" />}
              title="Pay with Crypto"
              description="Powered by Coinbase"
              onClick={() => setSelectedPaymentMethod('coinbase')}
              selected={selectedPaymentMethod === 'coinbase'}
            />
          </div>

          {selectedPaymentMethod && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-8"
            >
              {selectedPaymentMethod === 'paystack' && (
                <PaystackPayment
                  email="user@example.com" // You might want to get this from user context or remove if not needed
                  amount={100} // Amount in cents
                  reference={`TRX-${new Date().getTime()}`}
                  onSuccess={handlePaymentSuccess}
                  onClose={handlePaymentClose}
                />
              )}
              {selectedPaymentMethod === 'coinbase' && (
                <Checkout productId='my-product-id' onStatus={statusHandler}>
                  <CheckoutButton coinbaseBranded className="w-full py-3 text-lg" />
                  <CheckoutStatus />
                </Checkout>
              )}
            </motion.div>
          )}
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
              <p>Your Farcaster account has been successfully funded.</p>
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
