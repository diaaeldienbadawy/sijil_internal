import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import TenderListParams from "../params/tender-list-params";
import { Tender } from "@/lib/models/tenders/tender";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";

export const getTender = createAsyncThunk<Tender,string,{ rejectValue: ApiError }>(
    'tender',
    async(id:string,{rejectWithValue})=>{
        try{
        return FetchHelper.get<Tender>(API_ENDPOINTS.TENDER.TENDER(id),{needAuthorization:true})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)