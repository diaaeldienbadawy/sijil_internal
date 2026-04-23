import { Tender } from "@/lib/models/tenders/tender";

interface Props{
    tender:Tender
}

export default function TenderDetailsLocalContentSection({tender}:Props){
    return(
        <div className="tender-details-dates">
            <div className="tender-details-date">
                <div className="text-muted">آليات المحتوى المحلي</div>
                <div>
                    {tender.local_content_requirement?.mechanisms?.map((mechanism) => <div className="badge-gold">{mechanism}</div>)}
                </div>
            </div>

        </div>
    )
}