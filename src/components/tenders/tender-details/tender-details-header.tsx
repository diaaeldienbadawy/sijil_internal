import { Tender } from "@/lib/models/tenders/tender";
import { CalendarRangeIcon } from "lucide-react";

interface Props{
    tender:Tender
}

export default function TenderDetailsHeader({tender}:Props){
    return(
        <div className="flex justify-between tender-details-header">
            <div className="flex">
                <div>
                    {tender.tender_type}
                </div>
                <div className="flex px-4 gap-x-2 m-auto">
                    <div className="m-auto">
                        <CalendarRangeIcon className="m-auto" size={16}/>
                    </div>
                    <div className="m-auto">
                        {tender.publish_date}
                    </div>
                </div>
            </div>
            <div>
                {tender.competition_status}
            </div>
        </div>
    )
}