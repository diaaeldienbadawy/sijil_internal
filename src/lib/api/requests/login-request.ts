import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_ENDPOINTS } from "../endpoints"
import { FetchHelper } from "../fetch-helper"

export interface LoginPayload{
    username:string
    password:string
}

export interface LoginResponse{
    access_token:string
}

export const loginRequest = createAsyncThunk(
    'login',
    async(data:LoginPayload)=>{
        return FetchHelper.postForm<LoginPayload,LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
    }
)