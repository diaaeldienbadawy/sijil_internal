import { AccessTokens } from "@/lib/models/access-tokens"
import { createSlice } from "@reduxjs/toolkit"

export const accessTokensSlice = createSlice({
    name:'access-tokens-slice', 
    initialState : {} as AccessTokens,
    reducers:{
        setTendersAccessToken:(state, action)=>{
            return {...state, tendersAccessToken : action.payload}
        },
        setJudgesAccessToken:(state, action)=>{
            return {...state,judgesAccessToken: action.payload}
        },
        setUpdatesAccessToken:(state, action)=>{
            return {...state,updatesAccessToken: action.payload}
        },
        clear:(state)=>{
            return{...state, tendersAccessToken : undefined , judgesAccessToken:undefined , updatesAccessToken: undefined}
        }
    }
})

export const {setTendersAccessToken,setJudgesAccessToken,setUpdatesAccessToken,clear} = accessTokensSlice.actions