"use client"
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState } from 'react'
import NewSession from './NewSession'

function HistoryList() {
    const[historyList,setHistoryList]=useState([])
  return (

    <div className='mt-10'>
        {historyList.length==0?
        <div className='flex flex-col justify-center items-center gap-3 border p-7 border-dashed rounded-2xl border-2'>
            <Image src={'/medical-assistance.png'} alt='' height={200} width={200}/>
            <h2 className='font-bold text-xl'>No recent check-up</h2>
            <p>
                You haven't consuled any doctor recently
            </p>
            <NewSession/>
        </div>:
        <div>
            List
        </div>    
    }
    </div>
  )
}

export default HistoryList