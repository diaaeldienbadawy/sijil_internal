import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { loginRequest } from "@/lib/api/requests/login-request"

export const loginSlice = createSlice(
    {
        name:'login', 
        initialState : getInitialApiState(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(loginRequest.pending,(state)=>{
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginRequest.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.error.message || "Api Failed"
            })
            .addCase(loginRequest.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = '';
                state.data = action.payload
            })
        }
    }
)