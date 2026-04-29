import { JudgesSearchParams } from "@/lib/api/params/judges-search-params"
import { getJudgesFilters } from "@/lib/api/requests/get-judges-filters"
import { getJudgesListRequest } from "@/lib/api/requests/get-judges-list-request"
import useRequest from "@/lib/api/requests/use-request"
import { JudgesFiltersResponse } from "@/lib/api/responses/judges-filters-response"
import { JudgesSearchResponse } from "@/lib/api/responses/judges-search-response"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { useEffect } from "react"

export default function useJudgesFilter(){
    const {callEmptyApi,callApi} = useRequest()
    const filters = useAppSelector((state)=>state.judgesFilter)
    const filtersData = useAppSelector(state=>state.judgesFiltersData)
    const courtsList : string[] = filtersData.data?.courts ?? []
    const citiesList : string[] = filtersData.data?.cities ?? []
    const yearsList : number[] = filtersData.data?.years ?? []
    
    useEffect(()=>{
        callEmptyApi<JudgesFiltersResponse>({
            request:getJudgesFilters,
            platform:'judges',
            args:{}
        })

        callApi<JudgesSearchParams, JudgesSearchResponse>({
            request:getJudgesListRequest,
            platform:'judges',
            args:{data:{}}
        })
    },[])

    const searchAction =  async()=>{

    }
    
    return({
        searchAction,
        filters,
        citiesList,
        courtsList,
        yearsList
    })
}