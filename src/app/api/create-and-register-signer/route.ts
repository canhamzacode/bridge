/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { mnemonicToAccount } from 'viem/accounts';

export async function POST(req: NextRequest) {
  const appFid = process.env.NEXT_FARCASTER_DEVELOPER_FID;
  const account = mnemonicToAccount(process.env.NEXT_FARCASTER_DEVELOPER_MNEMONIC as string);
  
  try {
    // Step 1: Create the signer with Pinata
    const createSignerResponse = await fetch("https://api.pinata.cloud/v3/farcaster/signers", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PINATA_JWT}`,
      },
      body: JSON.stringify({ app_fid: parseInt(appFid as string, 10) }),
    });

    const signerInfo = await createSignerResponse.json().catch((error)=>{
        console.log("error with signer", error);
        return error;
    });

    // Step 2: Register the signer
    const { signer_uuid, public_key } = signerInfo.data;
    const deadline = Math.floor(Date.now() / 1000) + 86400; // Signature valid for 1 day

    // Signing the registration request
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

    // Sending registration request to Pinata
    const registerResponse = await fetch("https://api.pinata.cloud/v3/farcaster/register_signer_with_warpcast?sponsored=true", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PINATA_JWT}`,
      },
      body: JSON.stringify({
        signer_id: signer_uuid,
        signature: signature,
        deadline: deadline,
        app_fid: appFid,
        app_address: account.address,
      }),
    });

    const warpcastPayload = await registerResponse.json();

    // Return the signer info and warpcast payload
    return NextResponse.json({ signerInfo, warpcastPayload }, { status: 200 });
    
  } catch (error) {
    console.error("Error creating and registering signer:", error);
    return NextResponse.json({ error: 'Failed to create and register signer' }, { status: 500 });
  }
}
