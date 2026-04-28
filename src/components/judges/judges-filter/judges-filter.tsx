import FormButton from "@/components/form/from-button"
import SearchInput from "@/components/form/serach-input"
import { getJudgesListRequest } from "@/lib/api/requests/get-judges-list-request"
import { useAppDispatch } from "@/lib/redux/hooks"
import { useEffect } from "react"
import useJudgesFilter from "./use-judges-filter"
import { setCourt, setHasAppeal, setSearch, setSearchMode } from "@/lib/redux/slices/state_slices/judges-filter-content-slice"

export default function JudgesFilter(){
    const {searchAction, filters , citiesList , courtsList, yearsList} = useJudgesFilter()
    
    const dispatch = useAppDispatch()

    console.log("filters is ", filters)
    
    return(        
        <div className="tenders-filter-card bg-[rgba(200,200,200,0.1)] rounded-md border border-1">
            <div className="p-1 flex justify-between flex-wrap w-full">
                <div className="flex  gap-4 lg:hidden justify-end w-full ">
                    <div className="flex text-primary cursor-pointer hover:text-gold transition-colors duration-300">
                        <div className="h-full p-0">                
                            <div className="h-full p-0 flex">
                                <FormButton
                                    varient="default" 
                                    text="بحث" 
                                    action={searchAction}
                                    className="w-full text-paper px-5 rounded-md text-md hover:bg-primary-light hover:text-gold-light transition-colors duration-300 h-full m-auto"
                                />
                            </div>
                        </div> 
                    </div>
                </div>
                <div className="flex gap-x-4 flex-wrap md:gap-0">
                    <div className="flex py-2 w-full md:w-auto">
                        <div className="m-auto w-auto px-3">البحث</div>
                        <SearchInput
                            className="tenders-search-field"
                            value={filters.search}
                            setValue={(e)=>dispatch(setSearch(e))}
                            placeholder="ابحث في الاحكام"
                            searchMode={filters.searchMode}
                            setSearchMode={(e)=>dispatch(setSearchMode(e))}
                            type="judges"
                        />
                    </div>
                    <div className="flex flex-col gap-1 py-3 md:px-2 justify-start w-[100%] md:w-auto">
                        <div className="flex gap-2">
                            <div className="my-auto text-nowrap px-2">
                                 الاستأناف :      
                            </div>
                            <div 
                                className={`my-auto border border-1 border-gray-300 py-1 px-5 rounded-xl cursor-pointer ${filters.has_appeal == true ? 'bg-primary-light text-paper':''}`}  
                                onClick={()=>dispatch(setHasAppeal(true))}    
                            >
                                نعم
                            </div>
                            <div 
                                className={`my-auto border border-1 border-gray-300 py-1 px-5 rounded-xl cursor-pointer ${filters.has_appeal == false ? 'bg-primary-light text-paper':''}`}
                                onClick={()=>dispatch(setHasAppeal(false))}   
                            >
                                لا
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gap-2 py-2 hidden lg:flex ">
                    <div className="flex text-primary cursor-pointer hover:text-gold transition-colors duration-300">
                        <div className=" p-0">                
                            <div className=" p-0 h-full flex">
                                <FormButton 
                                    varient="default" 
                                    text="بحث" 
                                    action={searchAction}
                                    className="w-full text-paper px-5 rounded-md text-md hover:bg-primary-light hover:text-gold-light transition-colors duration-300 h-full m-auto"
                                />
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <div className= {`${'p-1 py-5'}  flex w-full flex-wrap gap-10`}>
                <div className="flex gap-2 w-auto flex-col md:flex-row">
                    <div className="m-auto w-auto">المحكمة</div>
                    <select 
                        className="add-filter-select w-full min-w-[200px]" 
                        value={filters.court ?? 'default'} 
                        onChange={(e)=> { dispatch(setCourt(e.target.value))}}
                        
                    >
                        <option value="default" disabled defaultChecked >المحكمة</option>
                        {
                            courtsList.map((state,index)=>(
                                <option key={index} value={state}>{state}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="flex gap-2 w-auto flex-col md:flex-row">
                    <div className="m-auto w-auto">المدينة</div>
                    <select className="add-filter-select w-full min-w-[200px]" value={filters.court ?? 'default'} onChange={(e)=> { dispatch(setCourt(e.target.value))}}>
                        <option value="default" disabled defaultChecked >المدينة</option>
                        {
                            citiesList.map((state,index)=>(
                                <option key={index} value={state}>{state}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="flex gap-2 w-auto flex-col md:flex-row">
                    <div className="m-auto w-auto text-nowrap">النسة الهجرية</div>
                    <select className="add-filter-select w-full min-w-[200px]" value={filters.court ?? 'default'} onChange={(e)=> { dispatch(setCourt(e.target.value))}}>

                        <option value="default" disabled defaultChecked >السنة</option>
                        {
                            yearsList.map((state,index)=>(
                                <option key={index} value={state}>{state}</option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </div>
    )
}