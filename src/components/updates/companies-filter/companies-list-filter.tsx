import { getCompanyUpdates } from "@/lib/api/requests/get-companies"
import useRequest from "@/lib/api/requests/use-request"
import { useEffect } from "react"

export default function CompaniesListFilter(){
    const {callApi} = useRequest()

    useEffect(()=>{
        callApi({
            request:getCompanyUpdates,
            platform:'updates',
            args:{data:{}}
        })        
    },[])
    
    return (
        <></>
    )
}