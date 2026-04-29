import { createAsyncThunk } from "@reduxjs/toolkit";
import { CompaniesListResponse } from "../responses/companies-list-response";
import { CompaniesListParams } from "../params/companies-list-params";
import { ApiError } from "../responses/api-error";
import { FetchHelper } from "../fetch-helper";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosError } from "axios";
import { PayloadedRequestArgs } from "./request-args";

export const getCompanyUpdates = createAsyncThunk<CompaniesListResponse,PayloadedRequestArgs<CompaniesListParams,CompaniesListResponse>,{ rejectValue: ApiError }>(
    'company-updates',
    async({data,onSuccess,onError,accessToken},{rejectWithValue})=>{
        try{
            return await FetchHelper.get<CompaniesListResponse>(API_ENDPOINTS.UPDATES.LIST(data),{accessToken,onSuccess,onError},false)
        } catch (e) {
          const error = e as AxiosError<ApiError>;
                
          return rejectWithValue(
            error.response?.data || { detail: "Unknown error" }
          );
        }
    }
)