import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { TenderMin } from "@/lib/models/tender-min";
import { TenderListResponse } from "../responses/tenders-list-response";

export const getTenders = createAsyncThunk(
    'tenders',
    async(params:TenderListParams[])=>{
        return FetchHelper.get<TenderListResponse>(API_ENDPOINTS.TENDER.LIST(params),{needAuthorization:true})
    }
)