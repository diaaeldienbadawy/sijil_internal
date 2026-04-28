"use client"

import PopoverDialog from "@/components/layout/popover-dialog";
import TenderDetails from "@/components/tenders/tender-details/tender-details";
import TendersList from "@/components/tenders/tenders-list/tenders-list";
import TendersPageHeader from "@/components/tenders/tender-page-header/tenders-page-header";
import TendersFilter from "@/components/tenders/tenders-pager-filter/tenders-filter";

export default function TendersPage(){

    return(
        <div className="h-[100%] flex flex-col gap-5">
            <TendersPageHeader/>
            <TendersFilter/>
            <TendersList/>
        </div>
    )
}