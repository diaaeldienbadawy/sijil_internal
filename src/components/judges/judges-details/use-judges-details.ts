import { getJudgementDetails } from "@/lib/api/requests/get-judgement-details"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect } from "react"

export default function useJudgesDetails({caseIndex}:{caseIndex:number}){
    const state = useAppSelector(state=>state.judgementDetails)
    const dispatch = useAppDispatch()
    
    useEffect(()=>{
        if(caseIndex) dispatch(getJudgementDetails(caseIndex))
    },[caseIndex])

    return({
        isLoading:state.isLoading,
        data:state.data,
        error:state.error
    })
}