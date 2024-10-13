import { Navbar } from '@/components/Navbar'
import { ConnectButton } from '@/components/Wallet'
import React from 'react'

const AuthScreen = () => {
  return (
    <>
        <Navbar />
        <div className='max-w-[770px] w-full mt-10 mx-auto flex flex-col gap-8 min-h-[600px]'>
            <h1 className='text-center text-3xl font-semibold'>Login to BridgePay Account</h1>
            <ConnectButton />
        </div>
    </>
  )
}

export default AuthScreen