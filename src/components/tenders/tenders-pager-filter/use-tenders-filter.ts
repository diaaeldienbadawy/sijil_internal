import { getTenders } from "@/lib/api/requests/get-tenders";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect } from "react";

export default function useTendersFilter(){
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(getTenders([]))
    },[])
}