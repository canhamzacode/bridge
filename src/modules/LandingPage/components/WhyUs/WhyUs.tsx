import React from 'react';
import "./whyus.css";

const WhyUs = () => {
  return (
    <div className='bg-[#0F1826]  px-4 py-20 mt-20 relative'>
      <div className='w-full max-w-[1400px] mx-auto grid md:grid-cols-2 md:text-left text-center gap-32 relative'>
        <div className='max-w-[412px] md:mx-0 mx-auto flex flex-col gap-6'>
          <h3 className='text-xl font-semibold whyus__text'>WHY CHOOSE BRIDGEPAY?</h3>
          <div className='flex flex-col gap-3'>
            <h2 className='text-2xl text-white'>Unlock the Future of Payments with BridgePay</h2>
            <p className='text-[#B8C0CC]'>
              BridgePay combines the convenience of local payment methods with the security of blockchain. Our platform makes onboarding to decentralized networks simple, with vouchers that are easy to purchase and redeem. Experience seamless account creation with Farcaster and enjoy low transaction fees, instant access, and future-proof technology—all with just your bank card.
            </p>
          </div>
        </div>

        {/* Right Side Cards */}
        {/* <div className='absolute flex gap-6 items-center right-0 -top-32'>
          <div className='flex flex-col gap-6'>
            <div className='h-[250px] w-[225px] bg-[#172233] rounded-lg pt-10 px-4'></div>
            <div className='h-[250px] w-[225px] bg-[#172233] rounded-lg pt-10 px-4'></div>
          </div>
          <div className='flex flex-col gap-6'>
            <div className='h-[250px] w-[225px] bg-[#172233] rounded-lg pt-10 px-4'></div>
            <div className='h-[250px] w-[225px] bg-[#172233] rounded-lg pt-10 px-4'></div>
            <div className='h-[250px] w-[225px] bg-[#172233] rounded-lg pt-10 px-4'></div>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default WhyUs;
