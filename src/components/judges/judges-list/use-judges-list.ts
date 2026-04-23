import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { changeTenderDetailsId } from "@/lib/redux/slices/state_slices/tender-details-id"
import { useEffect, useState } from "react"

export default function useJudgesList(){
    const [firstLoad, setFirstLoad] = useState(false)

    const {data,isLoading,error} = useAppSelector((state)=>state.judges)
    const dispatch = useAppDispatch()


    return({data,isLoading,error,firstLoad})
}