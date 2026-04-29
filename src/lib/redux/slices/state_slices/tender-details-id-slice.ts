import { createSlice } from "@reduxjs/toolkit"

export const tenderDetailsId = createSlice({
    name:'tenderDetailsId', 
    initialState : {id:undefined} as {id?:string},
    reducers:{
        change:(state, action)=>{
            state.id = action.payload 
            return state
        },
        clear:(state)=>{
            state.id = undefined
            return state
        }
    }
})

export const {change:changeTenderDetailsId, clear: clearTenderDetailsId} = tenderDetailsId.actions