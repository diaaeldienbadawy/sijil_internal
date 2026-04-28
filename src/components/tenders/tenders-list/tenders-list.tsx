import MutatingDots from "@/components/utility/spinners/mutating-dots";
import useTendersList from "./use-tenders-list";
import TenderCard from "../tender-card/tender-card";
import CustomPagination from "@/components/layout/custom-pagination";

export default function TendersList(){
    const {dataList,isLoading, error, firstLoad,filters} = useTendersList()

    console.log("datalist ", dataList)

    return (
        isLoading || !firstLoad? <MutatingDots/>:
            <>
            {
                dataList ? (
                    <>
                    {
                        dataList.items.length ?(
                        dataList.items.map((item,index)=><TenderCard key={index} tender={item}/>)
                        ):<div className="h-full flex items-center justify-center">no tenders available</div>
                    }
                    <CustomPagination 
                        totalPages={dataList?.meta.total} 
                        currentPage={dataList.meta.page}
                        path="/user/tenders" 
                    />
                    </>
                ) :<div className="h-full flex items-center justify-center">no tenders available</div>
            }                    
            </>
    )
}