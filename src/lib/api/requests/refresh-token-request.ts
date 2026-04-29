import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { TokenResponse } from "../responses/token-response";
import { API_ENDPOINTS } from "../endpoints";
import { AxiosError } from "axios";
import { ApiError } from "../responses/api-error";
import { EmptyRequestArgs } from "./request-args";

export const refreshTokenRequest = createAsyncThunk<TokenResponse,EmptyRequestArgs<TokenResponse>,{ rejectValue: ApiError }>(
    'login',
    async({onError,onSuccess},{rejectWithValue})=>{
        try{
            return FetchHelper.emptyPost<TokenResponse>(API_ENDPOINTS.AUTH.LOGIN,{onError,onSuccess});
            } catch (e) {
              const error = e as AxiosError<ApiError>;
        
              return rejectWithValue(
                error.response?.data || { detail: "Unknown error" }
              );
            }
    }
)