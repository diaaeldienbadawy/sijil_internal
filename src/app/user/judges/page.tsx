"use client";

import JudgesFilter from "@/components/judges/judges-filter/judges-filter";
import JudgesList from "@/components/judges/judges-list/judges-list";
import JudgesPageHeader from "@/components/judges/judges-page-header/judges-page-header";

export default function JudgesPage(){
    return(
        <div className="min-h-[100%] flex flex-col">
            <JudgesPageHeader/>
            <JudgesFilter/>
            <JudgesList/>
        </div>
    )
}