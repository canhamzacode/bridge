/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { mnemonicToAccount } from 'viem/accounts';

export async function POST(req: NextRequest) {
  const appFid = process.env.NEXT_FARCASTER_DEVELOPER_FID;
  const account = mnemonicToAccount(process.env.NEXT_FARCASTER_DEVELOPER_MNEMONIC as string);
  console.log("appfid....", appFid);

  try {
    const response = await fetch("https://api.pinata.cloud/v3/farcaster/signers", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PINATA_JWT}`,
      },
      body: JSON.stringify({ app_fid: parseInt(appFid as string, 10) }),
    });

    const signerInfo = await response.json();
    return NextResponse.json(signerInfo, { status: 200 });
  } catch (error) {
    console.error("Error creating signer:", error);
    return NextResponse.json({ error: 'Failed to create signer' }, { status: 500 });
  }
}
