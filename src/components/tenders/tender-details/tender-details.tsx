import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import useTenderDetails from "./use-tender-details"

interface Props{
    id:string
}

export default function TenderDetails({id}:Props){
    const {data,isLoading,error} = useTenderDetails({id})
    
}