import { getTender } from "@/lib/api/requests/get-tender-request"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect } from "react"

interface Props{
    id: string
}
export default function useTenderDetails({id}:Props){
    const {data,isLoading, error} = useAppSelector(state=>state.tender)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(getTender(id))
    },[])

    return{
        data,
        isLoading,
        error
    }
}