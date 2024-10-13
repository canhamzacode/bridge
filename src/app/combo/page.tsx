'use client';

import { useState } from 'react';

export default function SignersPage() {
  const [signerInfo, setSignerInfo] = useState(null);
  const [warpcastPayload, setWarpcastPayload] = useState(null);
  const [error, setError] = useState('');

  const createAndRegisterSigner = async () => {
    try {
      const res = await fetch('/api/create-and-register-signer', {
        method: 'POST',
      });
      const data = await res.json();

      if (res.ok) {
        setSignerInfo(data.signerInfo);
        setWarpcastPayload(data.warpcastPayload);
      } else {
        setError(data.error || 'Failed to create and register signer');
      }
    } catch (err) {
      setError('Failed to create and register signer');
    }
  };

  return (
    <div>
      <h1>Farcaster Signers</h1>
      <button className='bg-primary' onClick={createAndRegisterSigner}>Create and Register Signer</button>

      {signerInfo && <div>Signer Info: {JSON.stringify(signerInfo)}</div>}
      {warpcastPayload && <div>Warpcast Payload: {JSON.stringify(warpcastPayload)}</div>}
      {error && <p>{error}</p>}
    </div>
  );
}
