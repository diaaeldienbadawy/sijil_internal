
import { TenderMin } from "@/lib/models/tenders/tender-min"
import CardTitle from "./card-title"
import CardHeader from "./card-header"
import CardDescription from "./card-description"
import CardFooter from "./card-footer"
import { useAppDispatch } from "@/lib/redux/hooks"
import TenderDetails from "../tender-details/tender-details"
import { changeTenderDetailsId } from "@/lib/redux/slices/state_slices/tender-details-id"
import { openPopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice"

interface Props{
    tender: TenderMin
}

export default function TenderCard({tender}:Props){
    const dispatch = useAppDispatch()
    
    const onCardClick = () => {
        dispatch(changeTenderDetailsId(tender.id))
        dispatch(openPopoverDialog(<TenderDetails/>))
    }

    return(
        <div className="py-4">
            <div className="tender-card" onClick={onCardClick}>
                <CardHeader tender={tender}/>
                <CardTitle tender={tender}/>
                <CardDescription tender={tender}/>
                <CardFooter tender={tender}/>
            </div>
        </div>
    )
}