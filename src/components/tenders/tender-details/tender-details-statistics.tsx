import { Tender } from "@/lib/models/tender";

interface Props{
    tender:Tender
}

export default function TenderDetailsStatistics({tender}:Props){
    return(
        <div className="tender-details-statistics">
            <div className="statistic">
                <div>الرقم المرجعي</div>
                <div>{tender.reference_number}</div>
            </div>
            <div className="statistic">
                <div>تاريخ النشر</div>
                <div>{tender.publish_date}</div>
            </div>
            <div className="statistic">
                <div>قيمة الوثائق</div>
                <div>{tender.documents_price_sar} ر.س</div>
            </div>
            <div className="statistic">
                <div>الوقت المتبقى</div>
                <div>{tender.remaining_time_text}</div>
            </div>
        </div>
    )
}