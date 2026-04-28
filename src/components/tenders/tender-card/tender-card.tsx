
import { TenderMin } from "@/lib/models/tenders/tender-min"
import CardTitle from "./card-title"
import CardHeader from "./card-header"
import CardDescription from "./card-description"
import CardFooter from "./card-footer"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import TenderDetails from "../tender-details/tender-details"
import { changeTenderDetailsId } from "@/lib/redux/slices/state_slices/tender-details-id"
import { openPopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice"

interface Props{
    tender: TenderMin

}

export default function TenderCard({tender}:Props){
    const dispatch = useAppDispatch()
    const filters = useAppSelector((state)=>state.tenderFilterParameters)
    
    const onCardClick = () => {
        dispatch(changeTenderDetailsId(tender.id))
        dispatch(openPopoverDialog(<TenderDetails/>))
    }

    return(
        <div className="py-4">
            <div className="card" onClick={onCardClick}>
                <CardHeader tender={tender}/>
                <CardTitle tender={tender}/>
                <CardDescription tender={tender} highlightText={filters.search.value}/>
                <CardFooter tender={tender}/>
            </div>
        </div>
    )
}