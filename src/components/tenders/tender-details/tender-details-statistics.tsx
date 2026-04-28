import { DateTimeHelper } from "@/lib/helpers/date-time-helper";
import NumbersHelper from "@/lib/helpers/numbers-helper";
import { Tender } from "@/lib/models/tenders/tender";

interface Props{
    tender:Tender
}

export default function TenderDetailsStatistics({tender}:Props){
    return(
        <div className="popover-content-details-statistics flex flex-wrap">
            <div className="statistic">
                <div>الرقم المرجعي</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.reference_number??''))}</div>
            </div>
            <div className="statistic">
                <div>تاريخ النشر</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.publish_date??''))}</div>
            </div>
            <div className="statistic">
                <div>قيمة الوثائق</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.documents_price_sar??''))} ر.س</div>
            </div>
            <div className="statistic">
                <div>الوقت المتبقى</div>
                <div>{DateTimeHelper.dashToSlash(NumbersHelper.toArabicDigits(tender.remaining_time_text??''))}</div>
            </div>
        </div>
    )
}