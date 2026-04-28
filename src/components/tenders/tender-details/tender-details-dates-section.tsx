import { DateTimeHelper } from "@/lib/helpers/date-time-helper";
import NumbersHelper from "@/lib/helpers/numbers-helper";
import { Tender } from "@/lib/models/tenders/tender";
import dayjs from 'dayjs';

interface Props{
    tender:Tender
}

export default function TenderDetailsDatesSection({tender}:Props){
    return(
        <div className="popover-content-details-dates">
            <div className="popover-content-details-date">
                <div className="text-muted">اخر موعد للاستفسارات</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.dates?.inquiries_deadline_date??''))}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">اخر موعد لتقديم العروض</div>
                <div>{NumbersHelper.toArabicDigits( DateTimeHelper.fmtDateTime(tender.dates?.bid_submission_deadline_at))}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">تاريخ تقييم العروض</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.dates?.bid_evaluation_date??''))}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">تاريخ الترسية المتوقعة</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.dates?.expected_award_date??''))}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">تاريخ بدء العمل</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.dates?.work_start_date??''))}</div>
            </div>
        </div>
    )
}