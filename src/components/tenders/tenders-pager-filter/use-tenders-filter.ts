import useCustomPagination from "@/components/layout/hooks/use-custom-pagination";
import TenderListParams from "@/lib/api/params/tender-list-params";
import { getTenders } from "@/lib/api/requests/get-tenders";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useEffect, useState } from "react";

interface FilterContent{
    id:number,
    available:boolean, 
    name:string, 
    data:
    {    
        param:string, 
        value?:string,
        type: 'date'|'text'|'bool'
    }[]

}

export default function useTendersFilter(){
    const dispatch = useAppDispatch()
    const {currentPage} = useCustomPagination()

    const [search, setSearch] = useState<string | undefined>()
    const [searchMode, setSearchMode] = useState<"automatic" | "phrases" | "segments">("automatic")
    const [awardingPublished, setAwardingPublished] = useState<boolean|undefined>()

    const [filters, setFilters] = useState<FilterContent[]>(()=>{
        return [
            {id:1, available:true, name:"معرف جهة الإرسال", data: [{param : "senderId" , value: undefined ,type:'text'}]}, 
            {id:2, available:false, name:"رقم المراسلة", data:[{param:"referenceNumber", value: undefined,type:'text'}]},
            {id:3, available:false, name:"رقم المناقصة", data:[{param:"tenderNumber", value: undefined,type:'text'}]},
            {id:4, available:true, name:" تاريخ النشر ( من )", data: [
                {param:"publishDateFrom", value: undefined, type : 'date'},
                {param:"publishDateTo", value: undefined, type : 'date'}
            ]}, 
            {id:5, available:false, name:"موعد إغلاق الاستفسارات ( من )", data:[
                {param:"inquiriesDeadlineDateFrom", value: undefined, type : 'date'},
                {param:"inquiriesDeadlineDateTo", value: undefined, type : 'date'}
            ]}, 
            {id:6, available:false, name:"تاريخ تقييم العروض ( من )", data:[
                {param:"bid_evaluationDateFrom", value: undefined, type : 'date'},
                {param:"bid_evaluationDateTo", value: undefined, type : 'date'}
            ]}, 
            {id:7, available:false, name:"تاريخ التقدير ( من )", data : [
                {param:"expectedAwardDateFrom", value: undefined, type : 'date'},
                {param:"expectedAwardDateTo", value: undefined, type : 'date'}
            ]}, 
            {id:8, available:false, name:"تاريخ بداية العمل ( من )", data : [
                {param:"workStartDateFrom", value: undefined, type : 'date'},
                {param:"workStartDateTo", value: undefined, type : 'date'}
            ]},
            {id:9, available:false, name:"تاريخ بداية الأسئلة ( من )", data : [
                {param:"questionStartDateFrom", value: undefined, type : 'date'},
                {param:"questionStartDateTo", value: undefined, type : 'date'}
            ]}, 
            {id:10, available:false, name:"موعد تقديم العروض ( من )", data :[
                {param:"bidSubmissionDeadlineDateFrom", value: undefined, type : 'date'},
                {param:"bidSubmissionDeadlineDateTo", value: undefined, type : 'date'}
            ]}, 
            {id:11, available:false, name:"تاريخ فتح العروض ( من )", data:[
                {param:"bidOpeningDateFrom", value: undefined, type : 'date'},
                {param:"bidOpeningDateTo", value: undefined, type : 'date'}
            ]}
        ]
    })

    function updateFilterAvailablity(
        name:string, 
        available:boolean
    ) { 
        setFilters((prev) => prev.map((filter) => filter.name === name ? { ...filter, available:available } : filter )) 
    }

    function updateFilterValue(
      name: string,
      param: string,
      value?: string
    ) {
      setFilters((prev) =>
        prev.map((filter) =>
          filter.name === name
            ? {
                ...filter,
                data: filter.data.map((item) =>
                  item.param === param
                    ? { ...item, value }
                    : item
                ),
              }
            : filter
        )
      )
    }

    function createFiltersString(): TenderListParams{
        const map :Map<number,FilterContent> = new Map<number,FilterContent>()

        filters.forEach(element => {
            map.set(element.id,element)
        });

        let params: TenderListParams = {
            search:search,
            search_mode:searchMode,
        };

        return params;
    }

    function searchAction(){

    }

    useEffect(()=>{
        dispatch(getTenders({page:currentPage, search}))
    },[currentPage])

    return{
        search,
        setSearch,
        searchMode,
        setSearchMode,
        filters,
        setFilters,
        updateFilterValue,
        awardingPublished,
        setAwardingPublished,
        updateFilterAvailablity
    }
}