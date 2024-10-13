import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Hero = () => {
  return (
    <div className='w-full  px-4 my-11 max-w-[1400px] mx-auto grid tablet:grid-cols-2 grid-cols-1 gap-40'>
        <div className='w-full'>
            <div className=' pl-1 py-1 pr-6 bg-[#EBEEF2] rounded-2xl flex gap-3 items-center text-base w-[399px]'>
                <div className='bg-primary rounded-2xl py-1 px-4 text-white font-bold'>INTRODUCING</div>
                <p className='text-[#202D40]'>Innovative Digital Voucher</p>
            </div>
            <div className='mt-10'>
              <h1 className='text-primary text-3xl'>BRIDGEPAY</h1>
              <div className='flex flex-col gap-6 mt-6'>
                <p className='text-2xl text-[#202D40]'>Bridging the gap between onchain and offchain onboarding</p>
                <p>Bridge online and offline worlds effortlessly.Buy vouchers with your local bank card.Redeem securely on blockchain.Create your account in minutes.No crypto expertise needed.Start exploring today</p>
                <div className='flex items-center gap-6'>
                  <Link href="/auth" className='px-3 py-2 rounded-md bg-primary text-white'>Buy Voucher</Link>
                  <Link href="/auth" className='px-3 py-2 rounded-md border-primary border text-primary'>Redeem Voucher</Link>
                </div>
              </div>
            </div>
        </div>
        <div>
          <Image src="/heroImg.svg" alt='hero img' height={546} width={546} />
        </div>
    </div>
  )
}

export default Hero