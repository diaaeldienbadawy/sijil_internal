import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchHelper } from "../fetch-helper";
import { TokenResponse } from "../responses/token-response";
import { API_ENDPOINTS } from "../endpoints";

export const refreshTokenRequest = createAsyncThunk(
    'login',
    async()=>{
        return FetchHelper.emptyPost<TokenResponse>(API_ENDPOINTS.AUTH.LOGIN,{});
    }
)