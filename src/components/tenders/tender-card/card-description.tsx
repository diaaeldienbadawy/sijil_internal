import { TenderMin } from "@/lib/models/tenders/tender-min"

interface Props {
    tender : TenderMin
}

export default function CardDescription({tender}:Props){
    return(
        <div className="card-description">
            {tender.purpose}
        </div>
    )
}