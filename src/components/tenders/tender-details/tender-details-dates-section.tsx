import { DateTimeHelper } from "@/lib/helpers/date-time-helper";
import { Tender } from "@/lib/models/tender";
import dayjs from 'dayjs';

interface Props{
    tender:Tender
}

export default function TenderDetailsDatesSection({tender}:Props){
    return(
        <div className="tender-details-dates">
            <div className="tender-details-date">
                <div className="text-muted">اخر موعد للاستفسارات</div>
                <div>{tender.dates?.inquiries_deadline_date}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">اخر موعد لتقديم العروض</div>
                <div>{ DateTimeHelper.fmtDateTime(tender.dates?.bid_submission_deadline_at)}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">تاريخ تقييم العروض</div>
                <div>{tender.dates?.bid_evaluation_date}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">تاريخ الترسية المتوقعة</div>
                <div>{tender.dates?.expected_award_date}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">تاريخ بدء العمل</div>
                <div>{tender.dates?.work_start_date}</div>
            </div>
        </div>
    )
}