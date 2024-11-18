/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';

type SignerInfo = {
  signer_uuid: string;
  public_key: string;
};

type WarpcastPayload = {
  somePayloadKey: string; // Adjust this based on your API response.
};

export default function SignersPage() {
  const [signerInfo, setSignerInfo] = useState<SignerInfo | null>(null);
  const [warpcastPayload, setWarpcastPayload] = useState<WarpcastPayload | null>(null);
  const [error, setError] = useState('');

  const createSigner = async () => {
    try {
      const res = await fetch('/api/create-signer', {
        method: 'POST',
      });

      const data: { data: SignerInfo } = await res.json();
      setSignerInfo(data.data);
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
          signer_uuid: signerInfo.signer_uuid,
          public_key: signerInfo.public_key,
        }),
      });

      const data: { data: WarpcastPayload } = await res.json();
      setWarpcastPayload(data.data);
    } catch (err) {
      setError('Failed to register signer');
    }
  };

  return (
    <div className=''>
      <h1>Farcaster Signers</h1>
      <button className='bg-primary' onClick={createSigner}>Create Signer</button>
      <button onClick={registerSigner} disabled={!signerInfo}>Register Signer</button>

      {signerInfo && <pre>Signer Info: {JSON.stringify(signerInfo, null, 2)}</pre>}
      {warpcastPayload && <pre>Warpcast Payload: {JSON.stringify(warpcastPayload, null, 2)}</pre>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
