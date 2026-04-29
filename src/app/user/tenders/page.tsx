"use client"

import PopoverDialog from "@/components/layout/popover-dialog";
import TenderDetails from "@/components/tenders/tender-details/tender-details";
import TendersList from "@/components/tenders/tenders-list/tenders-list";
import TendersPageHeader from "@/components/tenders/tender-page-header/tenders-page-header";
import TendersFilter from "@/components/tenders/tenders-pager-filter/tenders-filter";
import { useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";
import MutatingDots from "@/components/utility/spinners/mutating-dots";

export default function TendersPage(){
    const accessTokens = useAppSelector(s=>s.accessTokens)

    useEffect(()=>{
        console.log("tenders access token" , accessTokens.tendersAccessToken)
    },[accessTokens.tendersAccessToken])

    return(
        !accessTokens.tendersAccessToken ? <MutatingDots/>:
        <div className="h-[100%] flex flex-col gap-5">
            <TendersPageHeader/>
            <TendersFilter/>
            <TendersList/>
        </div>
    )
}