import { JudgmentSummary } from "@/lib/models/judges/judgment-summary";
import JudgeCardHeader from "./judge-card-header";
import JudgeCardDescription from "./judge-card-description";
import JudgeCardFooter from "./judge-card-footer";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { JudgeSearchResult } from "@/lib/models/judges/judge-search-result";
import { openPopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice";
import JudgesDetails from "../judges-details/judges-details";

export default function JudgesCard({data}:{data:JudgeSearchResult}){
    const dispatch = useAppDispatch()
    
    const filters = useAppSelector((state) => state.judgesFilter)

    const onCardClick = () => {
        dispatch(openPopoverDialog(<JudgesDetails caseIndex={data.index}/>))
    }

    return(
        <div className="py-4">
            <div className="card" onClick={onCardClick}>
                <JudgeCardHeader judge={data.initial_judgment}/>
                <JudgeCardDescription judge={data.initial_judgment} highlightedText={filters.search}/>
                <JudgeCardFooter judge={data}/>
            </div>
        </div>
    )
}