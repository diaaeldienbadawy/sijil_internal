import { JudgesSearchMode } from "./judges-search-mode"

export interface JudgeFilterContents{
    search?: string
    searchMode?: JudgesSearchMode,
    court?: string
    city?: string
    year?: number
    has_appeal?:boolean
    page?:string,
}   