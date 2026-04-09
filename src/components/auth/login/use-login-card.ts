import { loginRequest } from "@/lib/api/requests/login-request";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function useLoginCard(){
    const [username,setUserName] = useState<string|undefined>()
    const [password,setPassword] = useState<string|undefined>()
    const [error, setError] = useState<string|undefined>()
    const [remember, setRemember] = useState<boolean>()

    const selector = useAppSelector(state=>state.login)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        setError(selector.error)
        setError("خطأ خطأ خطأ خطأ خطأ")
    },[])

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
            dispatch(loginRequest({username: username!,password:password!}))
        }
    }

    return({
        username,
        setUserName,
        password,
        setPassword,
        error,
        remember,
        setRemember,
        loginAction,
        clearError
    })
}