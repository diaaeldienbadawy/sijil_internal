import { CompanySummery } from "@/lib/models/updates/company-summery";

export interface CompaniesListResponse{
    items : CompanySummery[]
    total : number
    limit : number
    offset: number
}