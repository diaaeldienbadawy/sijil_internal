import { useAppSelector } from "@/lib/redux/hooks"
import { da } from "date-fns/locale"

export default function useTendersList(){
    const {data,isLoading,error} = useAppSelector((state)=>state.tenders)

    return({data,isLoading,error})
}