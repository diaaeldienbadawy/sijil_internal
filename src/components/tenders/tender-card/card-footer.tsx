import { TenderMin } from "@/lib/models/tender-min"
import { BadgeIcon, Clock, DollarSign, ExternalLink, TagIcon } from "lucide-react"
import RiyalIcon from "../../../assets/icons/riyal.png";

interface Props {
    tender : TenderMin
}

export default function CardFooter({tender}:Props){
    const onClickLink = (e:React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation() 
        window.open(tender.details_url, "_blank")
    }

    return(
        <div className="flex justify-between tender-card-footer">
            <div className="flex gap-x-4">
                <div className="flex m-auto gap-x-1">
                    <TagIcon/>
                    {tender.reference_number}
                </div>
                <div className="flex m-auto gap-x-1">
                    <img src={RiyalIcon.src} alt="Riyal" style={{width:25 , height:20, margin:'auto'}} className="w-4"/>
                    {tender.documents_price_sar}
                </div>
                <div className="flex m-auto gap-x-1">
                    <Clock/>
                    {tender.remaining_time_text}
                </div>
            </div>
            <div>
                <div className="flex m-auto gap-x-1 e3tmad-link" onClick={(e)=>onClickLink(e)}>
                    <ExternalLink/>
                    اعتماد
                </div>
            </div>
        </div>
    )
}