import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { TokenResponse } from "@/lib/api/responses/token-response"
import { updatesLoginRequest } from "@/lib/api/requests/updates-login-request"

export const updatesLoginSlice = createSlice(
    {
        name:'updates-login', 
        initialState : getInitialApiState<TokenResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(updatesLoginRequest.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(updatesLoginRequest.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(updatesLoginRequest.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload as TokenResponse
                return state
            })
        }
    }
)