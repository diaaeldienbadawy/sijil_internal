import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { JudgesSearchResponse } from "@/lib/api/responses/judges-search-response"
import { getJudgesListRequest } from "@/lib/api/requests/get-judges-list-request"

export const judgesSlice = createSlice(
    {
        name:'judges', 
        initialState : getInitialApiState<JudgesSearchResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getJudgesListRequest.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getJudgesListRequest.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(getJudgesListRequest.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload as JudgesSearchResponse
                return state
            })
        }
    }
)