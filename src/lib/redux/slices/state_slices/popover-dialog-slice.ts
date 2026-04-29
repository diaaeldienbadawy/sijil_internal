import { createSlice } from "@reduxjs/toolkit"
import { tenderDetailsId } from "./tender-details-id-slice"
import { ReactNode } from "react"

export const popoverDialog = createSlice({
    name:'popoverDialogOpen', 
    initialState : {isOpen:false , content:undefined} as {isOpen:boolean, content?:ReactNode},
    reducers:{
        open:(state, action)=>{
            state.isOpen = true
            state.content = action.payload
            return state
        },
        close:(state)=>{
            state.isOpen = false
            state.content = undefined
            return state
        }
    }
})

export const {open:openPopoverDialog, close:closePopoverDialog} = popoverDialog.actions