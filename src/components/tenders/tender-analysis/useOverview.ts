import { Tender } from "@/lib/models/tenders/tender";
import { useMemo } from "react";

export default function useOverview({tenders}:{tenders?:Tender[]}){
    const totalTenders = useMemo(()=>tenders?.length,[tenders])

    const awardedList = useMemo(()=>{
        return tenders?.filter(i=>i.awarded).sort((a,b)=>Number(b.documents_price_sar)-Number(a.documents_price_sar));
    },[tenders])
    
    const {totalAwards , avgAwards} = useMemo(()=>{
        let total = 0;

        awardedList?.forEach(i=>total += Number(i.documents_price_sar));

        return {totalAwards:total, avgAwards:(total/(awardedList?.length??0))};
    },[tenders])

    const {heighestAward,lowestAward} = useMemo(()=>{
        const heighest = awardedList?.length ? awardedList?.[0].documents_price_sar : 0
        const lowest =awardedList?.length ? awardedList?.[awardedList.length-1].documents_price_sar : 0

        return {heighestAward:heighest, lowestAward:lowest}
    },[tenders])

    const {averageCompetitors} = useMemo(()=>{
        let total = 0;

        tenders?.forEach(i=>total += Number(i.bidders?.length))
        
        return {averageCompetitors : total / (tenders?.length??0)}
    },[tenders])

    return{totalTenders, totalAwards, avgAwards, heighestAward, lowestAward, averageCompetitors}
}