"use client";

import UpdatesPageHeader from "@/components/updates/updates-page-header/updates-page-header";
import UpdatesPageTabs from "@/components/updates/updates-page-tabs/updates-page-tabs";
import CompaniesView from "@/components/updates/views/companies-view";
import MutatingDots from "@/components/utility/spinners/mutating-dots";
import { useAppSelector } from "@/lib/redux/hooks";
import { useEffect } from "react";

export default function UpdatesPage(){
    const accessTokens = useAppSelector(state=>state.accessTokens)
    const selectedTabPage = useAppSelector(state=>state.currentPageTab)

    return(
        !accessTokens.updatesAccessToken ? <MutatingDots/>:
        <div className="h-[100%] flex flex-col gap-5">
            <UpdatesPageHeader/>
            <UpdatesPageTabs/>
            {
                selectedTabPage == 'companies' ? <CompaniesView/> : null
            }
        </div>
    )
}