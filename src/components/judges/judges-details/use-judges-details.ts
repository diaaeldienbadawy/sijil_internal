import { getJudgementDetails } from "@/lib/api/requests/get-judgement-details"
import useRequest from "@/lib/api/requests/use-request"
import { JudgeDetailsResponse } from "@/lib/api/responses/judge-details-response"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect } from "react"

export default function useJudgesDetails({caseIndex}:{caseIndex:number}){
    const state = useAppSelector(state=>state.judgementDetails)
    const {callApi} = useRequest()    

    useEffect(()=>{
        if(caseIndex) {
            callApi<number,JudgeDetailsResponse>({
                request : getJudgementDetails,
                platform:'judges',
                args:{data:caseIndex}
            })
        }
    },[caseIndex])

    return({
        isLoading:state.isLoading,
        data:state.data,
        error:state.error
    })
}