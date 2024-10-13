import Image from 'next/image'
import React from 'react'
import HowWeWorkCard from './HowWeWorkCard'

const data = [
    {
        img: "/buyVoucher.svg",
        title: "Buy a Voucher",
        key: "01",
        description: "Use your local bank card to quickly purchase a voucher. No crypto knowledge required!",
    },
    {
        img: "/redemeVoucher.svg",
        title: "Redeem Your Voucher",
        key: "02",
        description: "Redeem your voucher on our platform, and the base blockchain will validate it securely.",
    },
    {
        img: "/getWarpcast.svg",
        title: "Get Your Warpcast Account",
        key: "03",
        description: "After redemption, receive your seed phrase and instantly create a Warpcast account.",
    },
    {
        img: "/loginAnytime.svg",
        title: " Log in Anytime",
        key: "04",
        description: "Use your seed phrase to log in and access your Warpcast account whenever you need.",
    },
]

const HowWeWork = () => {
  return (
    <div className='w-full  px-4 mt-11 mb-24 max-w-[1400px] mx-auto flex flex-col gap-14'>
        <h2 className='text-3xl text-[#202D40] font-semibold w-full md:max-w-[153px]'>HOW WE WORK?</h2>
        <div className='grid md:grid-cols-4 grid-cols-1 gap-14'>
            {data.map((item, index)=>(
                <HowWeWorkCard  description={item.description} img={item.img} title={item.title} stat={item.key} index={index} />
            ))}
        </div>
    </div>
  )
}

export default HowWeWork