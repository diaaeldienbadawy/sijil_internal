import NumbersHelper from "@/lib/helpers/numbers-helper";
import { JudgmentDetail } from "@/lib/models/judges/judgement-details";
import { CalendarIcon, ExternalLinkIcon, Link2Icon, LinkIcon, LocateFixedIcon, LocateIcon, LocationEditIcon } from "lucide-react";

export default function JudgementContent({judgement}:{judgement?:JudgmentDetail}){
    return(
        !judgement? <div>no details available</div>:
        <div className="flex flex-col py-4">
            <div className="flex gap-4 flex-wrap">
                <div className="py-1 px-2 rounded-2xl bg-primary-light text-paper flex text-sm">
                    {judgement.court_name}
                </div>
                <div className="py-1 px-2 rounded-2xl bg-paper-light text-primary flex gap-2 text-sm">
                    <LocationEditIcon size={16}/>
                    {judgement.city}
                </div>
                <div className="py-1 px-2 rounded-2xl bg-paper-light text-primary flex gap-2 flex text-sm">
                    <CalendarIcon size={16}/>
                    {judgement.date}
                </div>
            </div>
            <div className="py-5 flex flex-col">
                <div className="flex">
                    <div className=" border-b-2 py-3 border-gold-light text-lg font-bold font-tajawal">نص الحكم</div>
                </div>
                <div className=" py-4 flex flex-col max-h-[450px] overflow-auto" >
                    <div>{NumbersHelper.toArabicDigits(judgement.text)}</div>
                </div>
            </div>
        </div>
    )
}