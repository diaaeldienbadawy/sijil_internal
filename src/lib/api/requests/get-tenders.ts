import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";

export const getTenders = createAsyncThunk(
    'tenders',
    async(params:TenderListParams[])=>{
        return FetchHelper.get(API_ENDPOINTS.TENDER.LIST(params),true)
    }
)