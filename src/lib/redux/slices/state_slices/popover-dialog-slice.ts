import { createSlice } from "@reduxjs/toolkit"
import { tenderDetailsId } from "./tender-details-id"
import { ReactNode } from "react"

export const popoverDialog = createSlice({
    name:'popoverDialogOpen', 
    initialState : {isOpen:false , content:undefined} as {isOpen:boolean, content?:ReactNode},
    reducers:{
        open:(state, action)=>{
            state.isOpen = true
            state.content = action.payload
        },
        close:(state)=>{
            state.isOpen = false
            state.content = undefined
        }
    }
})

export const {open:openPopoverDialog, close:closePopoverDialog} = popoverDialog.actions