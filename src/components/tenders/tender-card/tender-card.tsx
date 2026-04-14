
import { TenderMin } from "@/lib/models/tender-min"
import CardTitle from "./card-title"
import CardHeader from "./card-header"
import CardDescription from "./card-description"
import CardFooter from "./card-footer"

interface Props{
    tender: TenderMin
}

export default function TenderCard({tender}:Props){
    return(
        <div className="py-2">
            <div className="tender-card">
                <CardHeader tender={tender}/>
                <CardTitle tender={tender}/>
                <CardDescription tender={tender}/>
                <CardFooter tender={tender}/>
            </div>
        </div>
    )
}