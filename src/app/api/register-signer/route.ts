/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextApiRequest, NextApiResponse } from 'next';
import { mnemonicToAccount } from 'viem/accounts';

export default async function registerSigner(req: NextApiRequest, res: NextApiResponse) {
  const { signer_uuid, public_key } = req.body;
  const appFid = process.env.FARCASTER_DEVELOPER_FID;
  const account = mnemonicToAccount(process.env.FARCASTER_DEVELOPER_MNEMONIC as string);
  const deadline = Math.floor(Date.now() / 1000) + 86400; // Signature valid for 1 day

  const signature = await account.signTypedData({
    domain: {
      name: "Farcaster SignedKeyRequestValidator",
      version: "1",
      chainId: 10,
      verifyingContract: "0x00000000fc700472606ed4fa22623acf62c60553",
    },
    types: {
      SignedKeyRequest: [
        { name: 'requestFid', type: 'uint256' },
        { name: 'key', type: 'bytes' },
        { name: 'deadline', type: 'uint256' },
      ],
    },
    primaryType: 'SignedKeyRequest',
    message: {
      requestFid: BigInt(appFid as string),
      key: `0x${public_key}`,
      deadline: BigInt(deadline),
    },
  });

  try {
    const response = await fetch("https://api.pinata.cloud/v3/farcaster/register_signer_with_warpcast?sponsored=true", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
      },
      body: JSON.stringify({
        signer_id: signer_uuid,
        signature: signature,
        deadline: deadline,
        app_fid: appFid,
        app_address: account.address,
      }),
    });

    const warpcastPayload = await response.json();
    res.status(200).json(warpcastPayload);
  } catch (error) {
    res.status(500).json({ error: 'Failed to register signer' });
  }
}
