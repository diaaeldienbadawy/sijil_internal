import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_ENDPOINTS } from "../endpoints"
import { FetchHelper } from "../fetch-helper"
import { LoginPayload } from "../payload-data/login-payload";
import { TokenResponse } from "@/types";


export const loginRequest = createAsyncThunk(
    'login',
    async(data:LoginPayload)=>{
        return FetchHelper.postForm<LoginPayload,TokenResponse>(API_ENDPOINTS.AUTH.LOGIN, {data,needAuthorization:false});
    }
)