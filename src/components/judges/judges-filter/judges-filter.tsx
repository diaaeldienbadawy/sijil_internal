import { getJudgesListRequest } from "@/lib/api/requests/get-judges-list-request"
import { useAppDispatch } from "@/lib/redux/hooks"
import { useEffect } from "react"

export default function JudgesFilter(){
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(getJudgesListRequest({}))
    },[])
    
    return(<></>)
}