import { TenderMin } from "@/lib/models/tender-min"
import { BadgeIcon, Clock, DollarSign, ExternalLink } from "lucide-react"

interface Props {
    tender : TenderMin
}

export default function CardFooter({tender}:Props){
    return(
        <div className="flex justify-between tender-card-footer">
            <div className="flex gap-x-4">
                <div className="flex m-auto gap-x-1">
                    <BadgeIcon/>
                    {tender.reference_number}
                </div>
                <div className="flex m-auto gap-x-1">
                    <DollarSign/>
                    {tender.documents_price_sar} ر.س
                </div>
                <div className="flex m-auto gap-x-1">
                    <Clock/>
                    {tender.remaining_time_text}
                </div>
            </div>
            <div>
                <div className="flex m-auto gap-x-1 e3tmad-link">
                    <ExternalLink/>
                    اعتماد
                </div>
            </div>
        </div>
    )
}