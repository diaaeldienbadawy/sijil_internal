import { loginRequest } from "@/lib/api/requests/login-request";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation'
import { NextResponse } from "next/server";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {TokenResponse} from '../../../lib/api/responses/token-response'

export default function useLoginCard(){
    const [username,setUserName] = useState<string|undefined>()
    const [password,setPassword] = useState<string|undefined>()
    const [error, setError] = useState<string|undefined>()
    const [remember, setRemember] = useState<boolean>()

    const router = useRouter()

    const {data ,isLoading, error:dataError} = useAppSelector(state=>state.login)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        console.log("data error", dataError)
        setError(dataError)
    },[dataError])

    useEffect(()=>{
        onSuccessLogin()
    },[data])

    const onSuccessLogin = async()=>{
        console.log("data changed", data)
        if(data){

                const dataa = data as TokenResponse
                if(dataa.access_token) {
                    await cookieStore.set('access_token', dataa.access_token)
                    router.push('http://localhost:3000/user/tenders')
                    //NextResponse.redirect('/tenders')
                
            }
        }
    }

    const validate=():boolean=>{
        if(!username) {
            setError("username required")
            return false;
        }
        if(!password){
            setError("password required")
            return false
        }
        if(password.length < 8){
            setError("password must be at least 8 characters")
        }
        return true;
    }
    
    const clearError= ()=>setError(undefined)

    const loginAction = async()=>{
        if(validate()){
            setError(undefined)
            dispatch(loginRequest({data:{username: username!,password:password!}}))
        }
    }

    return({
        username,
        setUserName,
        password,
        setPassword,
        error,
        isLoading,
        remember,
        setRemember,
        loginAction,
        clearError
    })
}