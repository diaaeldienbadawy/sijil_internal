import { createAsyncThunk } from "@reduxjs/toolkit"
import { FetchHelper } from "../fetch-helper"
import { JudgesFiltersResponse } from "../responses/judges-filters-response"
import { API_ENDPOINTS } from "../endpoints"
import { AxiosError } from "axios"
import { ApiError } from "../responses/api-error"

export const getJudgesFilters = createAsyncThunk<JudgesFiltersResponse,{},{ rejectValue: ApiError }>(
    'judges-filters',
    async({},{rejectWithValue})=>{
        try{
        return await FetchHelper.get<JudgesFiltersResponse>(API_ENDPOINTS.JUDGES.Filters,{needAuthorization:false})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)
