import { AIDoctorAgents } from '@/shared/list'
import React from 'react'
import DoctorCard from './DoctorCard'

function DoctorsAgent() {
  return (
    <div className='mt-10'>
        <h2 className='font-bold text-xl'>AI Doctor's Available</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8'>
            {AIDoctorAgents.map((doctor,index)=>(
                <div key={index}>
                    <DoctorCard doctorAgent={doctor}/>
                </div>
            ))}
        </div>
    </div>
  )
}

export default DoctorsAgent