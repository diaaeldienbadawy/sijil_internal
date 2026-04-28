import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { TenderListResponse } from "@/types"
import { TenderMin } from "@/lib/models/tenders/tender-min"
import { getAnalysisTenderIds } from "@/lib/api/requests/get-tenders"

export const analysisTendersIdsSlice = createSlice(
    {
        name:'analysisTenderIds', 
        initialState : getInitialApiState<string[]>([]),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getAnalysisTenderIds.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getAnalysisTenderIds.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(getAnalysisTenderIds.fulfilled, (state,action)=>{
                const payload = action.payload as string[] | undefined;
                state.isLoading = false;
                state.error = undefined;
                state.data = state.data ? [...(state.data as string[]), ...(payload ?? [])] : (payload ?? [])
                return state
            })
        }
    }
)