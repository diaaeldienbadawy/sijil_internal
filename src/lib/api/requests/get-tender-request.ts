import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { Tender } from "@/lib/models/tenders/tender";

export const getTender = createAsyncThunk(
    'tender',
    async(id:string)=>{
        return FetchHelper.get<Tender>(API_ENDPOINTS.TENDER.TENDER(id),{needAuthorization:true})
    }
)