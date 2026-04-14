import { getTender } from "@/lib/api/requests/get-tender-request"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect } from "react"

export default function useTenderDetails(){
    const {data,isLoading, error} = useAppSelector(state=>state.tender)
    const {id} = useAppSelector(state=>state.tenderDetailsId)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(id) dispatch(getTender(id))
    },[id])

    return{
        data,
        isLoading,
        error
    }
}