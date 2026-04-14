import { TenderMin } from "@/lib/models/tender-min"
import { AlignCenterIcon, Building } from "lucide-react"

interface Props {
    tender : TenderMin
}

export default function CardTitle({tender}:Props){
    return(
        <div className="tender-card-title">
            <div className="title">
                {tender.name}
            </div>
            <div className="agency">
                <Building className="my-auto" size={18}/>
                {tender.agency_name}
            </div>
        </div>
    )
}