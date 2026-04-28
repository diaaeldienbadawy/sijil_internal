import MutatingDots from "@/components/utility/spinners/mutating-dots"
import useJudgesDetails from "./use-judges-details"
import JudgesDetailsHeader from "./judges-details-header"
import JudgesDetailsContent from "./judges-details-content"
import { JudgeDetailsResponse } from "@/lib/api/responses/judge-details-response"

export default function JudgesDetails({caseIndex}:{caseIndex:number}){
    const {data,error, isLoading} = useJudgesDetails({caseIndex})

    console.log("judge is ",data)

    return(
         isLoading?<MutatingDots/>  :
        data ? 
        <div className="flex flex-col h-full max-w-[1000px] popover-content-details ">
            <JudgesDetailsHeader judgement={data as JudgeDetailsResponse} />
            <div className="p-3 ">
                <JudgesDetailsContent judgement={data as JudgeDetailsResponse}/>
            </div>
        </div> 
        : 
        <div>judges details not available</div>
    )
}