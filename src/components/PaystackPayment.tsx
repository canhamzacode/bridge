/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { PaystackButton } from 'react-paystack';
interface PaystackPaymentProps {
  email: string;
  amount: number;  // Amount in kobo (1 Naira = 100 kobo)
  reference: string;  // Unique transaction reference
  onSuccess: (response: any) => void;
  onClose: () => void;
}

const PaystackPayment: React.FC<PaystackPaymentProps> = ({ email, amount, reference, onSuccess, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_live_c4c5da0f436a4370e0795c7f156e71f423d93978';
  
  if (!publicKey) {
    console.error('Paystack public key is not set');
    return (
      <div className="py-5 text-red-500">
        Error: Paystack public key is not configured. Please contact the administrator.
      </div>
    );
  }

  const componentProps = {
    email,
    amount,
    currency: 'GHS',
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Email",
          variable_name: "customer_email",
          value: email,
        },
      ],
    },
    publicKey,
    text: "Pay Now",
    onSuccess,
    onClose: () => {
      setError(null);
      onClose();
    },
    reference,
    onError: (error: Error) => {
      console.error('Paystack error:', error);
      setError("We could not process this transaction. Please try again or contact support.");
    },
  };

  return (
    <div className="py-5">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          <p>{error}</p>
          <button 
            onClick={() => setError(null)} 
            className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Try Again
          </button>
        </div>
      )}
      <PaystackButton {...componentProps} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" />
    </div>
  );
};

export default PaystackPayment;
