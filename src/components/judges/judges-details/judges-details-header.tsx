import { JudgeDetailsResponse } from "@/lib/api/responses/judge-details-response";
import NumbersHelper from "@/lib/helpers/numbers-helper";

interface Props{
    judgement:JudgeDetailsResponse
}

export default function JudgesDetailsHeader({judgement}:Props){
    return(
        <div className="flex justify-between popover-content-details-header">
            <div className="flex">
                <div>
                    {NumbersHelper.toArabicDigits(judgement.initial_judgment.judgment_number)}
                </div>
                <div className="flex px-4 gap-x-2 m-auto">
                    <div className="m-auto">
                        {NumbersHelper.toArabicDigits(judgement.initial_judgment.court_name)}
                    </div>
                </div>
            </div>
        </div>
    )
}