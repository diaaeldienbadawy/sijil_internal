import { Tender } from "@/lib/models/tenders/tender";

interface Props{
    tender:Tender
}

export default function TenderDetailsClassificationSection({tender}:Props){
    return(
        <div className="tender-details-dates">
            <div className="tender-details-date">
                <div className="text-muted">مجال التصنيف</div>
                <div>{tender.classification?.classification_field}</div>
            </div>
            <div className="tender-details-date">
                <div className="text-muted">نطاق التنفيذ</div>
                <div>{tender.classification?.execution_place?.scope}</div>
            </div>
            <div className="tender-details-date w-full">
                <div className="text-muted">مناطق التنفيذ</div>
                <div className="flex gap-2 flex-wra">{tender.classification?.execution_place?.regions?.map((region,index) => <div className="badge-gold" key={index}>{index !== 0 && '، '}{region.name}{' ('}{region.cities?.join(', ')}{') '}</div>)}</div>
            </div>
            <div className="tender-details-date w-full">
                <div className="text-muted">الأنشطة</div>
                <div className="flex gap-2 flex-wrap">{tender.classification?.activities?.map((activity) => <div className="badge-gold" key={activity}>{activity}</div>)}</div>
            </div>
        </div>
    )
}