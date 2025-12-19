"use client"

import { UserDetailContext } from '@/context/UserDetailContext';
import { useUser } from '@clerk/nextjs';
import axios from 'axios'
import { useContext, useEffect, useState } from 'react';

export type UsersDetail={
    name:string,
    email:string,
    credits:number
}

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const {user}=useUser();

    const [userDeatil,setUserDetail]=useState<any>();

    useEffect(()=>{
        user&&createNewUser();
    },[user])


    const createNewUser= async()=>{
        const result = await axios.post('/api/users');
        console.log(result.data)
        setUserDetail(result.data)
    }
  return (
    <div>
        <UserDetailContext.Provider value={{userDeatil,setUserDetail}}>
        {children}
        </UserDetailContext.Provider>
    </div>
  )
}

export default Provider