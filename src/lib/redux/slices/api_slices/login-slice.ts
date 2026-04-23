import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { loginRequest } from "@/lib/api/requests/login-request"
import { TokenResponse } from "@/lib/api/responses/token-response"

export const loginSlice = createSlice(
    {
        name:'login', 
        initialState : getInitialApiState<TokenResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(loginRequest.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(loginRequest.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.error.message || "Api Failed"
                return state
            })
            .addCase(loginRequest.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload
                return state
            })
        }
    }
)