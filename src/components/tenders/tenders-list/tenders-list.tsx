import MutatingDots from "@/components/utility/spinners/mutating-dots";
import useTendersList from "./use-tenders-list";
import TenderCard from "../tender-card/tender-card";

export default function TendersList(){
    const {data,isLoading, error} = useTendersList()

    return (
        isLoading ? <MutatingDots/>:
            !data ? "no tenders" :
                data.items.map((item,index)=><TenderCard key={index} tender={item} />)
    )
}