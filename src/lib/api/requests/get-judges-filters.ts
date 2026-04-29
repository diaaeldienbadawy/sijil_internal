import { createAsyncThunk } from "@reduxjs/toolkit"
import { FetchHelper } from "../fetch-helper"
import { JudgesFiltersResponse } from "../responses/judges-filters-response"
import { API_ENDPOINTS } from "../endpoints"
import { AxiosError } from "axios"
import { ApiError } from "../responses/api-error"
import { EmptyRequestArgs } from "./request-args"

export const getJudgesFilters = createAsyncThunk<JudgesFiltersResponse,EmptyRequestArgs<JudgesFiltersResponse>,{ rejectValue: ApiError }>(
    'judges-filters',
    async({onError,onSuccess,accessToken},{rejectWithValue})=>{
        try{
        return await FetchHelper.get<JudgesFiltersResponse>(API_ENDPOINTS.JUDGES.Filters,{accessToken,onError,onSuccess})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)
