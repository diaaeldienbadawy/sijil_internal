import MutatingDots from "@/components/utility/spinners/mutating-dots";
import useTendersList from "./use-tenders-list";
import TenderCard from "../tender-card/tender-card";

export default function TendersList(){
    const {dataList,isLoading, error} = useTendersList()

    console.log("datalist ", dataList)

    return (
        isLoading ? <MutatingDots/>:
            !dataList ? "no tenders" :
                dataList.items.map((item,index)=><TenderCard key={index} tender={item} />)
    )
}