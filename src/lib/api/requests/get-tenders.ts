import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { TenderMin } from "@/lib/models/tenders/tender-min";
import { TenderListResponse } from "../responses/tenders-list-response";

export const getTenders = createAsyncThunk(
    'tenders',
    async(params:TenderListParams)=>{
        return await FetchHelper.get<TenderListResponse>(API_ENDPOINTS.TENDER.LIST(params),{needAuthorization:true})
    }
)

export const getAnalysisTenderIds = createAsyncThunk<string[],TenderListParams>(
    'analysis-tenders',
    async(params:TenderListParams)=>{
        const response = await FetchHelper.get<TenderListResponse>(API_ENDPOINTS.TENDER.LIST(params),{needAuthorization:true})
        return response?.items.map(i=>i.id) ?? []
    }
)