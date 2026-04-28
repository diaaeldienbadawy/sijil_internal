import { createAsyncThunk } from "@reduxjs/toolkit"
import { FetchHelper } from "../fetch-helper"
import { JudgesFiltersResponse } from "../responses/judges-filters-response"
import { API_ENDPOINTS } from "../endpoints"
import { JudgeDetailsResponse } from "../responses/judge-details-response"
import { AxiosError } from "axios"
import { ApiError } from "../responses/api-error"

export const getJudgementDetails = createAsyncThunk<JudgeDetailsResponse,number,{ rejectValue: ApiError }>(
    'judgement-details',
    async(caseIndex:number,{rejectWithValue})=>{
        try{
        return await FetchHelper.get<JudgeDetailsResponse>(API_ENDPOINTS.JUDGES.JUDGEMENT(caseIndex),{needAuthorization:false})
                    } catch (e) {
                      const error = e as AxiosError<ApiError>;
                
                      return rejectWithValue(
                        error.response?.data || { detail: "Unknown error" }
                      );
                    }
    }
)
