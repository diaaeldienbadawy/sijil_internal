import { getTender } from "@/lib/api/requests/get-tender-request"
import useRequest from "@/lib/api/requests/use-request"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { clearTenderDetailsId } from "@/lib/redux/slices/state_slices/tender-details-id-slice"
import { useEffect } from "react"

export default function useTenderDetails(){
    const {data,isLoading, error} = useAppSelector(state=>state.tender)
    const {id} = useAppSelector(state=>state.tenderDetailsId)
    const dialogState = useAppSelector(state=>state.popoverDialogOpen)
    const dispatch = useAppDispatch()
    const {callApi} = useRequest()


    useEffect(()=>{
        if(id){
            callApi({
                request:getTender,
                args:{data:id},
                platform:'tenders'
            })
        } 
    },[id])
    
    useEffect(()=>{ dispatch(clearTenderDetailsId()) },[dialogState.isOpen])

    return{
        data,
        isLoading,
        error
    }
}