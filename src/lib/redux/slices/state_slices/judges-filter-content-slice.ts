import { createSlice } from "@reduxjs/toolkit"
import { TenderSearchMode } from "@/lib/models/tenders/tender-search-mode"
import { JudgeFilterContents } from "@/lib/models/judges/judges-filter-content"
import { JudgesSearchMode } from "@/lib/models/judges/judges-search-mode"


const initialData: JudgeFilterContents =  {}
            
export const judgesFilterContentSlice = createSlice(
    {
        name:'judges-filter-content', 
        initialState : initialData,
        reducers:{
            setSearch:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,search:value}
            },
            setSearchMode:(state,action)=>{
                console.log("searchhh ",action.payload)
                const value = action.payload as JudgesSearchMode|undefined
                console.log("searchhh ",value)
                return {...state,searchMode:value}
            },
            setCourt:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,court:value}
            },
            setCity:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,city:value}
            },
            setYear:(state,action)=>{
                const value = action.payload as number|undefined
                return {...state,year:value}
            },
            setHasAppeal:(state,action)=>{
                const value = action.payload as boolean|undefined
                return {...state,has_appeal:value}
            },
        }
    }
)

export const {
    setSearch,
    setSearchMode,
    setCity,
    setCourt,
    setHasAppeal,
    setYear
} = judgesFilterContentSlice.actions