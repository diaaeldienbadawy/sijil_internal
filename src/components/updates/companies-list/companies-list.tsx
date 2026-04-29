import MutatingDots from "@/components/utility/spinners/mutating-dots"
import { useAppSelector } from "@/lib/redux/hooks"
import CompanyCard from "../company-card/company-card"

export default function CompaniesList(){
    const {data, isLoading, error} = useAppSelector(s=>s.companyUpdates)
    return(
        isLoading? <MutatingDots/> :
            error ? <div className="m-auto">{error}</div> :
                data?.items?.map((d,index)=>(
                    <CompanyCard key={index} summery={d}/>
                ))
    )
}