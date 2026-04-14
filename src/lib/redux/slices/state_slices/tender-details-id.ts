import { createSlice } from "@reduxjs/toolkit"
import { getInitialApiState } from "../../ApiActionState"
import { Tender } from "@/lib/models/tender"
import { getTender } from "@/lib/api/requests/get-tender-request"

export const tenderDetailsId = createSlice({
    name:'tenderDetailsId', 
    initialState : {id:undefined} as {id?:string},
    reducers:{
        change:(state, action)=>{
            state.id = action.payload 
        },
        clear:(state)=>{
            state.id = undefined
        }
    }
})

export const {change:changeTenderDetailsId, clear: clearTenderDetailsId} = tenderDetailsId.actions