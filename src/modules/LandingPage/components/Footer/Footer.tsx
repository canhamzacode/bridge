import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className='w-full  px-4 my-11 max-w-[1400px] mx-auto'>
        <div className='flex flex-wrap justify-between'>
            <Image src="/logo.svg" alt='logo' width={152} height={50} />
            <div className='flex gap-20 flex-wrap text-[#3E4F69]'>
                <div className='flex flex-col gap-5'>
                    <h3 className='font-medium'>BRIDGEPAY</h3>
                    <p>Home</p>
                    <p>How we work</p>
                    <p>Features</p>
                </div>
                <div className='flex flex-col gap-5'>
                    <h3 className='font-medium'>CONTACT</h3>
                    <p>(+234) 81XXXXXXXX</p>
                    <p>office@bridgepay.com</p>
                    <p>www.bridgepay.com</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Footer