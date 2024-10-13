import Image from 'next/image'
import React from 'react'

interface IProps {
    index: number;
    title: string;
    img: string;
    description: string;
    stat: string;
}

const HowWeWorkCard = ({index, title, img, description, stat}: IProps) => {
  return (
    <div className={`flex flex-col gap-8 relative`}>
        <div className={`flex ${index === 1 || index === 3 ? 'md:flex-col-reverse flex-col' : 'flex-col'} gap-4`}>
            <div className={`${index === 1 || index === 3 ? 'flex md:items-center md:justify-center' : ''}`}>
                <Image src={img} alt="how we work" width={80} height={80} />
            </div>
            <div className='text-[#172233] flex flex-col gap-2'>
                <h3 className='text-base font-semibold'>{stat}</h3>
                <h3 className='text-base font-semibold'>{title}</h3>
                <p className='text-[#3E4F69]'>{description}</p>
            </div>
        </div>
        {index < 3 &&<div className='absolute md:flex hidden top-1/2 -right-7 transform -translate-y-1/2 '>
            <Image src={`/step${index+1}.svg`} alt='step' width={136} height={97} />
        </div>}
    </div>
  )
}

export default HowWeWorkCard