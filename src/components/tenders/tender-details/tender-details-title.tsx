import { Tender } from "@/lib/models/tenders/tender";
import { Building } from "lucide-react";

interface Props{
    tender:Tender
}

export default function TenderDetailsTitle({tender}:Props){
    return(
        <div className="tender-details-title">
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