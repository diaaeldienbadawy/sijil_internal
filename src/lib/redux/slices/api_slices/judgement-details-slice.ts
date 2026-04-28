import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { JudgeDetailsResponse } from "@/lib/api/responses/judge-details-response"
import { getJudgementDetails } from "@/lib/api/requests/get-judgement-details"

export const judgementDetailsSlice = createSlice(
    {
        name:'judgement-details-slice', 
        initialState : getInitialApiState<JudgeDetailsResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getJudgementDetails.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getJudgementDetails.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(getJudgementDetails.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload as JudgeDetailsResponse
                return state
            })
        }
    }
)