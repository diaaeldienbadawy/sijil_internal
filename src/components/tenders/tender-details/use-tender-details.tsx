import { getTender } from "@/lib/api/requests/get-tender-request"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { clearTenderDetailsId } from "@/lib/redux/slices/state_slices/tender-details-id"
import { useEffect } from "react"

export default function useTenderDetails(){
    const {data,isLoading, error} = useAppSelector(state=>state.tender)
    const {id} = useAppSelector(state=>state.tenderDetailsId)
    const dialogState = useAppSelector(state=>state.popoverDialogOpen)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(id) dispatch(getTender(id))
    },[id])
    
    useEffect(()=>{ dispatch(clearTenderDetailsId()) },[dialogState.isOpen])

    return{
        data,
        isLoading,
        error
    }
}