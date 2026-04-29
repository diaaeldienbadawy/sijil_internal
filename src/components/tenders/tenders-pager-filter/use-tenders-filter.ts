import useCustomPagination from "@/components/layout/hooks/use-custom-pagination";
import TenderListParams from "@/lib/api/params/tender-list-params";
import { TenderSearchMode } from "@/lib/models/tenders/tender-search-mode";
import { getTenders } from "@/lib/api/requests/get-tenders";
import TenderHelper from "@/lib/helpers/tender-helper";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";
import useRequest from "@/lib/api/requests/use-request";


export default function useTendersFilter(){
    const dispatch = useAppDispatch()
    const {currentPage} = useCustomPagination()
    const [anyFilterAvailable , setAnyFilterAvailable] = useState<boolean>(false)

    const filters = useAppSelector(state=>state.tenderFilterParameters)

    const {callApi} = useRequest()

    async function searchAction() {
        const params = TenderHelper.createFiltersString({filters,page:currentPage,limit:20})

        callApi({
            request:getTenders,
            platform:'tenders',
            args:{data:params}
        })
    }

    useEffect(()=>{
        searchAction()
    },[currentPage])

    useEffect(()=>{
        setAnyFilterAvailable(checkAnyFilterAvailable());
    },[filters])

    function checkAnyFilterAvailable():boolean{
        if(filters.bid_evaluation_date.available) return true;
        if(filters.bid_opening.available)return true;
        if(filters.bid_submission_deadline.available) return true;
        if(filters.expected_award_date.available) return true;
        if(filters.inquiries_deadline_date.available) return true;
        if(filters.publish_date.available) return true
        if(filters.questions_start_date.available) return true
        if(filters.reference_number.available) return true
        if(filters.sender_id.available) return true;
        if(filters.tender_number.available) return true;
        if(filters.work_start_date.available) return true;

        return false
    }

    return{
        filters,
        searchAction,
        dispatch,
        anyFilterAvailable
    }
}