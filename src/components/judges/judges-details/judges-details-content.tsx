import ReactiveTabs from "@/components/form/reactive-tabs";
import { JudgeDetailsResponse } from "@/lib/api/responses/judge-details-response";
import { useState } from "react";
import JudgementContent from "./judgement-content";
import { ExternalLinkIcon } from "lucide-react";

export default function JudgesDetailsContent({judgement}:{judgement:JudgeDetailsResponse}){
    const [selectedTab ,setSelectedTab] = useState<string>('initial')


    return(
      <div className="w-full flex flex-col min-w-[280px]">
        <ReactiveTabs
            value={selectedTab}
            onChange={setSelectedTab}
            tabs={[
                {name:'الحكم الابتدائي', value:'initial'},
                {name:'حكم الاستئناف', value:'appeal'}
            ]}
        />
        <div className="flex flex-col">
            <JudgementContent judgement={selectedTab == 'appeal' ? judgement.initial_judgment : judgement.appeal_judgment}/>
        </div>
        <div className="flex justify-center">
            <div className="flex gap-3 border border-0 border-primary p-3 rounded-2xl shadow shadow-md shadow-primary">
                <ExternalLinkIcon/>
                <div onClick={()=>window.open(judgement.url,'_blank')}>
                    عرض فى الموقع الرسمي
                </div>
            </div>
        </div>
      </div>  
    )
}