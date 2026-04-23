import { JudgmentSummary } from "@/lib/models/judges/judgment-summary";

export default function JudgeCardDescription({judge}:{judge:JudgmentSummary}){
    return(
        <div className="tender-card-description text-muted">
            {judge.preview}
        </div>
    )
}