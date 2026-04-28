import HighlightedText from "@/components/utility/spinners/highlighted-text";
import NumbersHelper from "@/lib/helpers/numbers-helper";
import { JudgmentSummary } from "@/lib/models/judges/judgment-summary";


export default function JudgeCardDescription({judge,highlightedText}:{judge:JudgmentSummary, highlightedText?: string}){
    return(
        <div className="card-description text-muted">
            <HighlightedText
                text={NumbersHelper.toArabicDigits(judge.preview)}
                highlight={highlightedText}
            />
        </div>
    )
}