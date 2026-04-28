import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { TenderMin } from "@/lib/models/tenders/tender-min";
import { TenderListResponse } from "../responses/tenders-list-response";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";

export const getTenders = createAsyncThunk<TenderListResponse,TenderListParams,{ rejectValue: ApiError }>(
    'tenders',
    async(params:TenderListParams,{rejectWithValue})=>{
        try{
        return await FetchHelper.get<TenderListResponse>(API_ENDPOINTS.TENDER.LIST(params),{needAuthorization:true})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)

export const getAnalysisTenderIds = createAsyncThunk<string[],TenderListParams,{rejectValue:ApiError}>(
    'analysis-tenders',
    async(params:TenderListParams,{rejectWithValue})=>{
        try{
        const response = await FetchHelper.get<TenderListResponse>(API_ENDPOINTS.TENDER.LIST(params),{needAuthorization:true})
        return response?.items.map(i=>i.id) ?? []
                            } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)