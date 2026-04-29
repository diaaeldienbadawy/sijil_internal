import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { TenderMin } from "@/lib/models/tenders/tender-min";
import { TenderListResponse } from "../responses/tenders-list-response";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";
import { PayloadedRequestArgs } from "./request-args";

export const getTenders = createAsyncThunk<TenderListResponse,PayloadedRequestArgs<TenderListParams,TenderListResponse>,{ rejectValue: ApiError }>(
    'tenders',
    async({data,onError,onSuccess,accessToken},{rejectWithValue})=>{
        try{
        return await FetchHelper.get<TenderListResponse>(API_ENDPOINTS.TENDER.LIST(data),{accessToken, onError, onSuccess})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)
