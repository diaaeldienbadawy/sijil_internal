import { createAsyncThunk } from "@reduxjs/toolkit"
import { API_ENDPOINTS } from "../endpoints"
import { FetchHelper } from "../fetch-helper"
import { LoginPayload } from "../payload-data/login-payload";
import { ApiError } from "../responses/api-error";
import { TokenResponse } from "../responses/token-response";
import { AxiosError } from "axios";
import { PayloadedRequestArgs } from "./request-args";


export const updatesLoginRequest = createAsyncThunk<
  TokenResponse,
  PayloadedRequestArgs<LoginPayload,TokenResponse>,
  { rejectValue: ApiError }
>(
  'login',
  async ({data, onSuccess , onError,accessToken}, { rejectWithValue }) => {
    try {
      const response = await FetchHelper.postForm<LoginPayload, TokenResponse>(
        API_ENDPOINTS.UPDATES_AUTH.LOGIN,
        { data , onError, onSuccess, accessToken},false
      );

      return response; 
    } catch (e) {
      const error = e as AxiosError<ApiError>;

      return rejectWithValue(
        error.response?.data || { detail: "Unknown error" }
      );
    }
  }
);