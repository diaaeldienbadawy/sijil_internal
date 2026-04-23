import { createAsyncThunk } from "@reduxjs/toolkit";
import { JudgesSearchParams } from "../params/judges-search-params";
import { FetchHelper } from "../fetch-helper";
import { JudgesSearchResponse } from "../responses/judges-search-response";
import { API_ENDPOINTS } from "../endpoints";


export const getJudgesListRequest = createAsyncThunk(
    'get-judges-list' ,
    async(params:JudgesSearchParams)=>{
            const response = await FetchHelper.get<JudgesSearchResponse>(API_ENDPOINTS.JUDGES.LIST(params),{needAuthorization:false})
            return response
        }
)