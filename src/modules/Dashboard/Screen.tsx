/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import PaystackPayment from '@/components/PaystackPayment';
import { FaCoins, FaTicketAlt, FaHistory, FaChartLine, FaExchangeAlt, FaBell } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { recordTransactionOnChain } from '@/utils/contractInteractions';

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'redeemed': return 'text-emerald-600 bg-emerald-100';
    case 'pending': return 'text-amber-600 bg-amber-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

interface Voucher {
  id: number;
  amount: string;
  status: string;
  date: string;
  redemptionDate?: string;
}

const DashboardScreen: React.FC = () => {
  const [transactionSuccess, setTransactionSuccess] = useState<boolean>(false);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [tokenBalance, setTokenBalance] = useState<number>(10);
  const [chartData, setChartData] = useState<{ date: string; balance: number }[]>([]);

  useEffect(() => {
    const fetchVouchers = async () => {
      const mockVouchers: Voucher[] = [
        { id: 1, amount: '$10', status: 'Redeemed', date: '2023-05-01', redemptionDate: '2023-05-05' },
        { id: 2, amount: '$10', status: 'Pending', date: '2023-05-10' },
        { id: 3, amount: '$5', status: 'Redeemed', date: '2023-05-15', redemptionDate: '2023-05-20' },
      ];
      setVouchers(mockVouchers);

      const mockChartData = [
        { date: '2023-05-01', balance: 10 },
        { date: '2023-05-05', balance: 15 },
        { date: '2023-05-10', balance: 25 },
        { date: '2023-05-15', balance: 20 },
        { date: '2023-05-20', balance: 30 },
      ];
      setChartData(mockChartData);
    };

    fetchVouchers();
  }, []);

  const handlePaymentSuccess = async (response: any) => {
    console.log('Payment successful:', response);
    
    // Record the transaction on the blockchain
    await recordTransactionOnChain(response.amount, response.currency);
    
    setTransactionSuccess(true);
    setTokenBalance(prevBalance => prevBalance + response.amount);
    setVouchers(prevVouchers => [
      {
        id: Date.now(),
        amount: `$${response.amount}`,
        status: 'Pending',
        date: new Date().toLocaleDateString()
      },
      ...prevVouchers,
    ]);
    setChartData(prevData => [
      ...prevData,
      { date: new Date().toLocaleDateString(), balance: tokenBalance + response.amount }
    ]);
    setTimeout(() => setTransactionSuccess(false), 3000);
  };

  const handlePaymentClose = () => {
    console.log("Payment process closed.");
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 min-h-screen text-slate-950">
      <Navbar authenticated />
      <main className="container mx-auto px-4 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8"
        >
          Dashboard
        </motion.h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-slate-100 rounded-lg shadow-lg p-6 border border-gray-400"
          >
            <div className="flex items-center mb-4">
              <FaCoins className="text-yellow-500 text-2xl mr-2" />
              <h2 className="text-xl font-semibold">Token Balance</h2>
            </div>
            <p className="text-3xl font-bold text-yellow-400">${tokenBalance}</p>
            <PaystackPayment
              email="user@example.com"
              amount={1500}
              reference={`TRX-${new Date().getTime()}`}
              onSuccess={(response: any) => handlePaymentSuccess(response)}
              onClose={handlePaymentClose}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
          >
            <div className="flex items-center mb-4">
              <FaTicketAlt className="text-blue-500 text-2xl mr-2" />
              <h2 className="text-xl font-semibold">Latest Voucher</h2>
            </div>
            <p className="text-3xl font-bold text-blue-400">
              {vouchers.length > 0 ? vouchers[0].amount : '$0'}
            </p>
            <PaystackPayment
              email="user@example.com"
              amount={500}
              reference={`TRX-${new Date().getTime()}`}
              onSuccess={handlePaymentSuccess}
              onClose={handlePaymentClose}
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
          >
            <div className="flex items-center mb-4">
              <FaChartLine className="text-green-500 text-2xl mr-2" />
              <h2 className="text-xl font-semibold">Balance Trend</h2>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="balance" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {transactionSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-900 border-l-4 border-green-500 text-green-100 p-4 mb-8 rounded-r"
            role="alert"
          >
            <p className="font-bold">Success!</p>
            <p>Your payment was processed successfully. Your balance has been updated.</p>
          </motion.div>
        )}

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaHistory className="text-purple-500 text-2xl mr-2" />
              <h2 className="text-2xl font-semibold">Voucher History</h2>
            </div>
            <div className="flex space-x-2">
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition duration-300 flex items-center">
                <FaExchangeAlt className="mr-2" /> Exchange
              </button>
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full transition duration-300 flex items-center">
                <FaBell className="mr-2" /> Notifications
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Purchase Date</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Voucher ID</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider">Redemption Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {vouchers.map((voucher) => (
                  <motion.tr
                    key={voucher.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700 transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{voucher.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{voucher.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{voucher.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(voucher.status)}`}>
                        {voucher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{voucher.redemptionDate || '-'}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default DashboardScreen;
