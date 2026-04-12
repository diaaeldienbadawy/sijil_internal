import { TenderMin } from "@/lib/models/tender-min"

interface Props{
    tender: TenderMin
}

export default function TenderCard({tender}:Props){
    return(
        <div>{tender.agency_name}</div>
    )
}