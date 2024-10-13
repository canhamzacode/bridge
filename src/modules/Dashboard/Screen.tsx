import { Navbar } from '@/components/Navbar'
import React from 'react'

// Voucher data
const vouchers = [
  { id: '001', date: '2024-09-28', amount: '$5', status: 'redeemed', redemptionDate: '2024-09-30' },
  { id: '002', date: '2024-09-25', amount: '$10', status: 'pending', redemptionDate: '-' },
  { id: '003', date: '2024-09-20', amount: '$7', status: 'failed', redemptionDate: '-' },
  { id: '004', date: '2024-09-15', amount: '$3', status: 'redeemed', redemptionDate: '2024-09-17' },
];

// Transaction data
const transactions = [
  { id: 'T001', date: '2024-09-28', type: 'Deposit', gasFee: '$0.50' },
  { id: 'T002', date: '2024-09-25', type: 'Withdrawal', gasFee: '$0.30' },
  { id: 'T003', date: '2024-09-20', type: 'Transfer', gasFee: '$0.45' },
  { id: 'T004', date: '2024-09-15', type: 'Deposit', gasFee: '$0.25' },
];

// Function to get status color
const getStatusClass = (status: string) => {
  switch (status) {
    case 'redeemed':
      return 'text-green-600';
    case 'pending':
      return 'text-yellow-600';
    case 'failed':
      return 'text-red-600';
    default:
      return 'text-gray-600';
  }
};

// Optional: Function to style transaction type
const getTransactionTypeClass = (type: string) => {
  switch (type) {
    case 'Deposit':
      return 'text-blue-600';
    case 'Withdrawal':
      return 'text-red-600';
    case 'Transfer':
      return 'text-purple-600';
    default:
      return 'text-gray-600';
  }
};

const DashboardScreen = () => {
  return (
    <div>
      <Navbar authenticated />
      <main className='w-full max-w-[1400px] mx-auto text-[#3E4F69]'>
        <div className='mt-8 flex items-center px-2 py-3 '>
          <div className='h-[99px] bg-[#FAFBFC] rounded-md w-[294px] flex flex-col gap-4 px-6 py-2 text-[#3E4F69]'>
            <h3 className='font-medium'>Your Token Balance</h3>
            <h2 className='text-2xl font-semibold'>$15</h2>
          </div>
          <div className='h-[99px] bg-[#FAFBFC] rounded-md w-[294px] flex flex-col gap-4 px-6 py-2 text-[#3E4F69]'>
            <h3 className='font-medium'>Lastest Voucher</h3>
            <h2 className='text-2xl font-semibold'>$5</h2>
          </div>
        </div>
        
        {/* Voucher History */}
        <div className='mt-6'>
          <h3 className='text-lg'>Voucher History</h3>
          <table className='py-10 flex flex-col gap-3'>
            <thead className='grid grid-cols-5 p-3 bg-gray-200'>
              <th className='text-left'>Purchase Date</th>
              <th className='text-left'>Voucher ID</th>
              <th className='text-left'>Voucher Amount</th>
              <th className='text-left'>Redemption Status</th>
              <th className='text-left'>Redemption Date</th>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id} className='grid grid-cols-5 p-3 bg-white'>
                  <td className='text-left'>{voucher.date}</td>
                  <td className='text-left'>{voucher.id}</td>
                  <td className='text-left'>{voucher.amount}</td>
                  <td className={`text-left font-semibold ${getStatusClass(voucher.status)}`}>
                    {voucher.status}
                  </td>
                  <td className='text-left'>{voucher.redemptionDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Transaction History */}
        <div className='mt-6'>
          <h3 className='text-lg'>Transaction History</h3>
          <table className='py-10 flex flex-col gap-3'>
            <thead className='grid grid-cols-4 p-3 bg-gray-200'>
              <th className='text-left'>Transaction ID</th>
              <th className='text-left'>Date</th>
              <th className='text-left'>Type</th>
              <th className='text-left'>Gas Fee</th>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className='grid grid-cols-4 p-3 bg-white'>
                  <td className='text-left'>{transaction.id}</td>
                  <td className='text-left'>{transaction.date}</td>
                  <td className={`text-left font-semibold ${getTransactionTypeClass(transaction.type)}`}>
                    {transaction.type}
                  </td>
                  <td className='text-left'>{transaction.gasFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default DashboardScreen
