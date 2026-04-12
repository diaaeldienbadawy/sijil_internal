"use client"

import TendersList from "@/components/tenders/tenders-list/tenders-list";
import TendersPageHeader from "@/components/tenders/tenders-page-header";
import TendersFilter from "@/components/tenders/tenders-pager-filter/tenders-filter";

export default function TendersPage(){
    return(
        <div className="">
            <TendersPageHeader/>
            <TendersFilter/>
            <TendersList/>
        </div>
    )
}