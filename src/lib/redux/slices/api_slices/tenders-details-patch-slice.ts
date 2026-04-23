import { createSlice } from "@reduxjs/toolkit";
import { getInitialApiState } from "../../ApiActionState";
import { Tender } from "@/lib/models/tenders/tender";
import { getTenderDetailsBatch } from "@/lib/api/requests/get-tender-details-batch";

export const tenderDetailsPatchSlice = createSlice(
    {
        name:'tenderDetailsPatch', 
        initialState : getInitialApiState<Tender[]>([]),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getTenderDetailsBatch.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getTenderDetailsBatch.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.error.message || "Api Failed"
                return state
            })
            .addCase(getTenderDetailsBatch.fulfilled, (state,action)=>{
                const payload =  action.payload as Tender[] | undefined;
                state.isLoading = false;
                state.error = undefined;
                state.data = state.data ? [...state.data, ...(payload ?? [])] : (payload ?? [])
                return state
            })
        }
    }
)