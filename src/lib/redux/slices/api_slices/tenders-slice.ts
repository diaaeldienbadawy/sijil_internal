import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { TenderListResponse } from "@/types"
import { getTenders } from "@/lib/api/requests/get-tenders"

export const tendersSlice = createSlice(
    {
        name:'tenders', 
        initialState : getInitialApiState<TenderListResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getTenders.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getTenders.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.error.message || "Api Failed"
                return state
            })
            .addCase(getTenders.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload
                return state
            })
        }
    }
)