import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { Tender } from "@/lib/models/tenders/tender";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";
import { PayloadedRequestArgs } from "./request-args";

export const getTender = createAsyncThunk<Tender,PayloadedRequestArgs<string,Tender>,{ rejectValue: ApiError }>(
    'tender',
    async({data,onSuccess,onError,accessToken},{rejectWithValue})=>{
        try{
        return FetchHelper.get<Tender>(API_ENDPOINTS.TENDER.TENDER(data),{accessToken,onSuccess,onError})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)