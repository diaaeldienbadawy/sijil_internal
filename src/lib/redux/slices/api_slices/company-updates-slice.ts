import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { CompaniesListResponse } from "@/lib/api/responses/companies-list-response"
import { getCompanyUpdates } from "@/lib/api/requests/get-companies"

export const companyUpdatesSlice = createSlice(
    {
        name:'tenders', 
        initialState : getInitialApiState<CompaniesListResponse>(),
        reducers:{},
        extraReducers:(builder)=>{
            builder.addCase(getCompanyUpdates.pending,(state)=>{
                state.isLoading = true;
                state.error = undefined;
                return state
            })
            .addCase(getCompanyUpdates.rejected, (state,action)=>{
                state.isLoading = false;
                state.error = action.payload?.detail
                state.data = undefined
                return state
            })
            .addCase(getCompanyUpdates.fulfilled, (state,action)=>{
                state.isLoading = false;
                state.error = undefined;
                state.data = action.payload as CompaniesListResponse
                return state
            })
        }
    }
)