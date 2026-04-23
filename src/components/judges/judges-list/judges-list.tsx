import MutatingDots from "@/components/utility/spinners/mutating-dots"
import useJudgesList from "./use-judges-list"
import CustomPagination from "@/components/layout/custom-pagination"
import JudgesCard from "../judges-card/judges-card"

export default function JudgesList(){
    const {data,isLoading,error} = useJudgesList()
    
    return(
        isLoading ? <MutatingDots/>:
        <>
        {
            data ? (
                <>
                <div className="h-[100%]">
                {
                    data.results.length ?(
                    data.results.map((item,index)=><JudgesCard key={index} data={item} />)
                    ):<div className="h-full flex items-center justify-center">no tenders available</div>
                }

                </div>
                <CustomPagination 
                    totalPages={data?.total_pages} 
                    currentPage={data.page}
                    path="/user/tenders" 
                />
                </>
            ) :<div className="h-full flex items-center justify-center">no tenders available</div>
        }                    
        </>
    )
}