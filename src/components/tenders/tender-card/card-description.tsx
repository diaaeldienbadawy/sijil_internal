import HighlightedText from "@/components/utility/spinners/highlighted-text"
import { TenderMin } from "@/lib/models/tenders/tender-min"

interface Props {
    tender : TenderMin,
    highlightText?:string
}

export default function CardDescription({tender,highlightText}:Props){
    return(
        <div className="card-description">
            <HighlightedText
                text={tender.purpose}
                highlight={highlightText}
            />
        </div>
    )
}