import NumbersHelper from "@/lib/helpers/numbers-helper";
import { JudgmentSummary } from "@/lib/models/judges/judgment-summary";

export default function JudgeCardHeader({judge}:{judge:JudgmentSummary}){
    return(        
        <div className="flex justify-between card-header">
            <div className="flex">
                <div>
                    {judge.court_name}
                </div>
                <div className="flex px-4 gap-x-2 m-auto">
                    <div className="m-auto">
                        {judge.city}
                    </div>
                    <div className="m-auto">
                        {judge.date}
                    </div>
                </div>
            </div>
            <div>
                رقم الحكم / {NumbersHelper.toArabicDigits(judge.judgment_number)}
            </div>
        </div>
        )
}