import { AccessTokens } from "@/lib/models/access-tokens"
import { createSlice } from "@reduxjs/toolkit"

export const currentPageTabSlice = createSlice({
    name:'current-page-tab-slice', 
    initialState : '' as string,
    reducers:{
        changeCurrentPageTab:(state, action)=>{
            state = action.payload
            return  state
        }
    }
})

export const {changeCurrentPageTab} = currentPageTabSlice.actions