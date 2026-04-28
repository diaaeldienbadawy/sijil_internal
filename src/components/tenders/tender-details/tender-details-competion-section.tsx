import NumbersHelper from "@/lib/helpers/numbers-helper";
import { Tender } from "@/lib/models/tenders/tender";

interface Props{
    tender:Tender
}

export default function TenderDetailsCompetionSection({tender}:Props){
    return(
        <div className="popover-content-details-dates">
            <div className="popover-content-details-date">
                <div className="text-muted">الغرض</div>
                <div>{NumbersHelper.toArabicDigits(tender.purpose??'')}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">طريقة التقديم</div>
                <div>{NumbersHelper.toArabicDigits(tender.submission_method??'')}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">مدة العقد</div>
                <div>{NumbersHelper.toArabicDigits(tender.agreement_duration??'')}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">الضمان الابتدائي</div>
                <div>{NumbersHelper.toArabicDigits(tender.preliminary_guarantee??'')}</div>
            </div>
            <div className="popover-content-details-date">
                <div className="text-muted">التأمين المطلوب</div>
                <div>{NumbersHelper.toArabicDigits(tender.insurance_required??'')}</div>
            </div>
        </div>
    )
}