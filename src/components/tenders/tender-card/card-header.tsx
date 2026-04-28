import { DateTimeHelper } from "@/lib/helpers/date-time-helper"
import NumbersHelper from "@/lib/helpers/numbers-helper"
import { TenderMin } from "@/lib/models/tenders/tender-min"
import { CalendarRangeIcon } from "lucide-react"

interface Props {
    tender : TenderMin
}

export default function CardHeader({tender}:Props){
    return(
        <div className="flex justify-between card-header">
            <div className="flex">
                <div>
                    {tender.tender_type}
                </div>
                <div className="flex px-7 gap-x-2 m-auto">
                    <div className="m-auto">
                        {/* <CalendarRangeIcon className="m-auto" size={22}/> */}
                    </div>
                    <div className="m-auto flex">
                        <div className="m-auto">
                            {NumbersHelper.toArabicDigits(DateTimeHelper.fmtShortDate(tender.publish_date ?? ''))}
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {tender.competition_status}
            </div>
        </div>
    )
}