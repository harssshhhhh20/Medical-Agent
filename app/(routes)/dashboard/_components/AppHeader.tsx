import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuOpt=[
    {
        id:1,
        name:'Home',
        path:'/dashboard'

    },
    {
        id:2,
        name:'History',
        path:'/dashboard/history'

    },
    {
        id:3,
        name:'Pricing',
        path:'/dashboard/pricing'

    },
    {
        id:4,
        name:'Profile',
        path:'/profile'

    },
]

function AppHeader() {
  return (
    <div className=' justify-between flex items-center p-4 shadow px-5 md:px-10 lg:px-15'>
        <Image src={'/med_logo.png'} alt='' width={560} height={160} className='w-[200px] '/>
        <div className='hidden md:flex items-center gap-12'>
            {menuOpt.map((option,index)=>(
                <Link href={option.path} key={index}>
                    <h2 className='hover:font-bold cursor-pointer transition-all'>{option.name}</h2>
                </Link>
            ))}
        </div>
        <UserButton/>
    </div>
  )
}

export default AppHeader