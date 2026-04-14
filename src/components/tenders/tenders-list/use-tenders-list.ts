import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { changeTenderDetailsId } from "@/lib/redux/slices/state_slices/tender-details-id"
import { da } from "date-fns/locale"
import { useEffect } from "react"

export default function useTendersList(){
    const {data:dataList,isLoading,error} = useAppSelector((state)=>state.tenders)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        if(dataList?.items.length) dispatch(changeTenderDetailsId(dataList.items[0].id))
    },[dataList])

    return({dataList,isLoading,error})
}