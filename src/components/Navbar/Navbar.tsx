import { Avatar, Name } from '@coinbase/onchainkit/identity'
import { ConnectWallet } from '@coinbase/onchainkit/wallet'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

interface IProps {
    authenticated?: boolean
}

const Navbar = ({authenticated = false}:IProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='w-full px-4 flex items-center justify-between border-b border-b-[#F5F7FA] py-1 bg-white'>
        <div className='w-full flex items-center justify-between max-w-[1400px] mx-auto'>
            <Link href='/'>
                <Image src="/logo.svg" alt='logo' width={152} height={50} />
            </Link>
            <div className='md:flex hidden items-center gap-32'>
                <div className='flex items-center gap-3'>
                    <button className='px-3 py-2 rounded-md bg-primary text-white'>Buy Voucher</button>
                    <button className='px-3 py-2 rounded-md border-primary border text-primary'>Redeem Voucher</button>
                </div>
                {!authenticated ? <div className='flex items-center gap-4'>
                    <Link href="/auth" className='text-primary'>Login</Link>
                    <div className='h-[88px] w-[56px] bg-primary text-white'></div>
                </div>: <div className='flex items-center gap-4'>
                    <ConnectWallet isOpen={isOpen} setIsOpen={setIsOpen}>
                        <Avatar className="h-6 w-6" />
                        <Name />
                    </ConnectWallet>
                </div>}
            </div>
        </div>
    </div>
  )
}

export default Navbar