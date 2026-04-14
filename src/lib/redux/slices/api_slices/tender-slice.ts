import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { Tender } from "@/lib/models/tender"
import { getTender } from "@/lib/api/requests/get-tender-request"

export const tenderSlice = createSlice(
    {
        name:'tender', 
        initialState : getInitialApiState<Tender>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getTender.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
            })
            .addCase(getTender.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.error.message || "Api Failed"
            })
            .addCase(getTender.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload
            })
        }
    }
)