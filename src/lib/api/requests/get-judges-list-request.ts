import { createAsyncThunk } from "@reduxjs/toolkit";
import { JudgesSearchParams } from "../params/judges-search-params";
import { FetchHelper } from "../fetch-helper";
import { JudgesSearchResponse } from "../responses/judges-search-response";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";
import { PayloadedRequestArgs } from "./request-args";


export const getJudgesListRequest = createAsyncThunk<JudgesSearchResponse,PayloadedRequestArgs<JudgesSearchParams,JudgesSearchResponse>,{ rejectValue: ApiError }>(
    'get-judges-list' ,
    async({data,onError,onSuccess,accessToken}, {rejectWithValue})=>{
        try{
            const response = await FetchHelper.get<JudgesSearchResponse>(API_ENDPOINTS.JUDGES.LIST(data),{accessToken,onError,onSuccess})
            return response            } catch (e) {
                          const error = e as AxiosError<ApiError>;
                    
                          return rejectWithValue(
                            error.response?.data || { detail: "Unknown error" }
                          );
                        }
        }
)