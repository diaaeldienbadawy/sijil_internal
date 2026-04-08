import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_ENDPOINTS } from "../endpoints"
import { FetchHelper } from "../fetch-helper"

export interface LoginPayload{
    username:string
    password:string
}

export interface LoginResponse{
    accessToken:string
}

export const loginRequest = createAsyncThunk(
    'login',
    async(data:LoginPayload)=>{
        return FetchHelper.post<LoginPayload,LoginResponse>(API_ENDPOINTS.AUTH.LOGIN,{data: data});
    }
)