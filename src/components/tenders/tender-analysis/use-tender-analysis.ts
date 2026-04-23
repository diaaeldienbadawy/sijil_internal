import { getTenderDetailsBatch } from "@/lib/api/requests/get-tender-details-batch";
import { getAnalysisTenderIds } from "@/lib/api/requests/get-tenders";
import TenderHelper from "@/lib/helpers/tender-helper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useMemo, useRef, useState } from "react";

export default function useTenderAnalysis(){
    const analysisTenderIds = useAppSelector(state=>state.analysisTenderIds)
    const analysisTenderDetails = useAppSelector(state=>state.tenderDetailsPatch)
    const parameters = useAppSelector(state=>state.tenderFilterParameters)
    const dispatch = useAppDispatch()
    const analyticsAbortRef = useRef(false)

    const [analyticsProgess,setAnalyticsProgess] = useState<{phase:string, current:number, total:number}>({phase:'', current:0, total: 0})

    const onProgress = (fetched: number, total: number)=>{
      if(!analyticsAbortRef.current) setAnalyticsProgess({phase:'جاري تحميل التفاصيل...',current:fetched,total:total});
    }

    useEffect(()=>{
      const page = Math.floor((analysisTenderIds.data?.length ??0) / 100) +1;

      if(!analysisTenderIds.data || analysisTenderIds.data?.length < 500){
        dispatch(getAnalysisTenderIds({...TenderHelper.createFiltersString({filters:parameters,limit:100, page})}))
      }else {
        if(analysisTenderIds.data?.length !< 500) dispatch(getTenderDetailsBatch({ids:analysisTenderIds.data??[] , batchSize:15 , onProgress:onProgress }))
      }

      if(analysisTenderIds.data == undefined || analysisTenderIds.data.length === 0){
        setAnalyticsProgess ({phase:'', current:0, total: 0})
      }
      else if(analysisTenderIds.data.length < 500){
        setAnalyticsProgess ({phase:'جاري تحميل المنافسات', current:analysisTenderIds.data.length , total: 500})
      }
    },[analysisTenderIds])
    
    return({analysisTenderIds:analysisTenderIds,analyticsProgess,analysisTenderDetails})
}