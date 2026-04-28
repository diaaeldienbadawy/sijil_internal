import { createAsyncThunk } from "@reduxjs/toolkit";
import { JudgesSearchParams } from "../params/judges-search-params";
import { FetchHelper } from "../fetch-helper";
import { JudgesSearchResponse } from "../responses/judges-search-response";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";


export const getJudgesListRequest = createAsyncThunk<JudgesSearchResponse,JudgesSearchParams,{ rejectValue: ApiError }>(
    'get-judges-list' ,
    async(params:JudgesSearchParams, {rejectWithValue})=>{
        try{
            const response = await FetchHelper.get<JudgesSearchResponse>(API_ENDPOINTS.JUDGES.LIST(params),{needAuthorization:false})
            return response            } catch (e) {
                          const error = e as AxiosError<ApiError>;
                    
                          return rejectWithValue(
                            error.response?.data || { detail: "Unknown error" }
                          );
                        }
        }
)