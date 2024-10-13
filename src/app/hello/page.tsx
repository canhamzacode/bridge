
// src/app/signers/page.tsx
'use client';

import { useState } from 'react';

export default function SignersPage() {
  const [signerInfo, setSignerInfo] = useState(null);
  const [warpcastPayload, setWarpcastPayload] = useState(null);
  const [error, setError] = useState('');

  const createSigner = async () => {
    try {
      const res = await fetch('/api/create-signer', {
        method: 'POST',
      });
      const data = await res.json();
      setSignerInfo(data);
    } catch (err) {
      setError('Failed to create signer');
    }
  };

  const registerSigner = async () => {
    if (!signerInfo) return;
    try {
      const res = await fetch('/api/register-signer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: signerInfo.data.signer_uuid,
          public_key: signerInfo.data.public_key,
        }),
      });
      const data = await res.json();
      setWarpcastPayload(data);
    } catch (err) {
      setError('Failed to register signer');
    }
  };

  return (
    <div className=''>
      <h1>Farcaster Signers</h1>
      <button className='bg-primary' onClick={createSigner}>Create Signer</button>
      <button onClick={registerSigner} disabled={!signerInfo}>Register Signer</button>

      {signerInfo && <div>Signer Info: {JSON.stringify(signerInfo)}</div>}
      {warpcastPayload && <div>Warpcast Payload: {JSON.stringify(warpcastPayload)}</div>}
      {error && <p>{error}</p>}
    </div>
  );
}
