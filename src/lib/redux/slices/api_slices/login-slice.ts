import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { loginRequest } from "@/lib/api/requests/login-request"
import { TokenResponse } from "@/types"
import { ApiError } from "@/lib/api/responses/api-error"

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
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(loginRequest.fulfilled, (state,action)=>{
                state.isLoading = false;
                if(action.payload){
                    state.data = action.payload as TokenResponse
                    state.error = undefined;
                }

                return state
            })
        }
    }
)