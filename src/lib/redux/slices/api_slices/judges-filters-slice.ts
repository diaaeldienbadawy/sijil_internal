import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { JudgesFiltersResponse } from "@/lib/api/responses/judges-filters-response"
import { getJudgesFilters } from "@/lib/api/requests/get-judges-filters"

export const judgesFiltersSlice = createSlice(
    {
        name:'judges-filters-slice', 
        initialState : getInitialApiState<JudgesFiltersResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getJudgesFilters.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getJudgesFilters.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(getJudgesFilters.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload as JudgesFiltersResponse
                return state
            })
        }
    }
)