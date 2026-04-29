'use client'

import { usePathname } from 'next/navigation'
import NavBar from "@/components/layout/navbar/navbar"
import PopoverDialog from './popover-dialog'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { loginRequest } from '@/lib/api/requests/login-request'
import { updatesLoginRequest } from '@/lib/api/requests/updates-login-request'
import { useEffect } from 'react'
import { tenderAccessToken, updatesAccessToken } from '@/lib/api/fetch-helper'
import useRequest from '@/lib/api/requests/use-request'
import { setTendersAccessToken, setUpdatesAccessToken } from '@/lib/redux/slices/state_slices/access-tokens-slice'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const _ = useLayoutWrapper()


  if (pathname.startsWith('/user')) {
    return (
      <div className="w-full h-[100%] bg-cream flex justify-center overflow-auto py-[60px] header-bg">
        <div className="max-w-[1400px] px-2 w-full" style={{zIndex:1}}>
          <PopoverDialog />
            {children}
        </div>
        <NavBar />
      </div>
    )
  }

  return <>{children}</>
}



function useLayoutWrapper(){
  const {callApi} = useRequest()
  const dispatch = useAppDispatch()

  useEffect(()=>{
    console.log("page started ")
    tenderLogin()
    updatesLogin()
  },[])
  
  function tenderLogin(){
    const username = 'abosetta@zofirm.com'
    const password = 'adminpassword'

    callApi({
      request:loginRequest, 
      platform:'tenders', 
      args:{
        data:{
          username,
          password
        },
        onSuccess:(v)=>{
          dispatch(setTendersAccessToken(v?.access_token))
        }
      }
    })
  }

  function updatesLogin(){
    const username = 'admin@example.com'
    const password = 'Admin123!'

    callApi({
      request:updatesLoginRequest, 
      platform:'tenders', 
      args:{
        data:{
          username,
          password
        },
        onSuccess:(v)=>dispatch(setUpdatesAccessToken(v?.access_token))
      }
    })
  }
}