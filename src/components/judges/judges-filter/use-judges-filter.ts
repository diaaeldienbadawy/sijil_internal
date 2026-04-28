import { getJudgesFilters } from "@/lib/api/requests/get-judges-filters"
import { getJudgesListRequest } from "@/lib/api/requests/get-judges-list-request"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect } from "react"

export default function useJudgesFilter(){
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state)=>state.judgesFilter)
    const filtersData = useAppSelector(state=>state.judgesFiltersData)
    const courtsList : string[] = filtersData.data?.courts ?? []
    const citiesList : string[] = filtersData.data?.cities ?? []
    const yearsList : number[] = filtersData.data?.years ?? []
    
    useEffect(()=>{
        dispatch(getJudgesFilters({}))
        dispatch(getJudgesListRequest({}))
    },[])

    const searchAction =  async()=>{

    }

    console.log("judges filters : ", filters)
    
    return({
        searchAction,
        filters,
        citiesList,
        courtsList,
        yearsList
    })
}