import { JudgmentSummary } from "@/lib/models/judges/judgment-summary";
import JudgeCardHeader from "./judge-card-header";
import JudgeCardTitle from "./judge-card-title";
import JudgeCardDescription from "./judge-card-description";
import JudgeCardFooter from "./judge-card-footer";
import { useAppDispatch } from "@/lib/redux/hooks";
import { JudgeSearchResult } from "@/lib/models/judges/judge-search-result";

export default function JudgesCard({data}:{data:JudgeSearchResult}){
    const dispatch = useAppDispatch()
    
    const onCardClick = () => {
    }

    return(
        <div className="py-4">
            <div className="card" onClick={onCardClick}>
                <JudgeCardHeader judge={data.initial_judgment}/>
                <JudgeCardDescription judge={data.initial_judgment}/>
                <JudgeCardFooter judge={data}/>
            </div>
        </div>
    )
}