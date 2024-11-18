/* eslint-disable react-hooks/exhaustive-deps */
import { Navbar } from '@/components/Navbar'
import React, { useEffect } from 'react'
import { Footer, Hero, HowWeWork, WhyUs } from './components'
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';

const LandingPageScreen = () => {  
  const { address } = useAccount();
  const router = useRouter();

  useEffect(()=>{
    console.log("address...",address);
  },[])
  if (address){
    router.push("/dashboard");
  }
  return (
    <div>
      <Navbar />
      <Hero />
      <HowWeWork />
      <WhyUs />
      <Footer />
    </div>
  )
}

export default LandingPageScreen