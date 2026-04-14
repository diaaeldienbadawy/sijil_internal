import { Tender } from "@/lib/models/tender";

interface Props{
    tender:Tender
}

export default function TenderDetailsCompetionSection({tender}:Props){
    return(
        <div className="tender-details-dates">
            <div className="tender-details-date">
                <div className="text-muted">الغرض</div>
                <div>{tender.purpose}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">طريقة التقديم</div>
                <div>{tender.submission_method}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">مدة العقد</div>
                <div>{tender.agreement_duration}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">الضمان الابتدائي</div>
                <div>{tender.preliminary_guarantee}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">التأمين المطلوب</div>
                <div>{tender.insurance_required}</div>
            </div>
        </div>
    )
}