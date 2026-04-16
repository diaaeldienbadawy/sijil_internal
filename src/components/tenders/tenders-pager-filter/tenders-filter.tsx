import LabeledInput from "@/components/form/labeled-input"
import useTendersFilter from "./use-tenders-filter"
import SearchInput from "@/components/form/serach-input"
import { Delete, DeleteIcon, ListCollapseIcon, Minus, Plus, Trash, Trash2, XIcon } from "lucide-react"
import FormButton from "@/components/form/from-button"
import { tenderStateList } from "./tender-state-list"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { set } from "date-fns"

export default function TendersFilter(){
    const {
        search, 
        setSearch , 
        searchMode, 
        setSearchMode, 
        filters, 
        setFilters, 
        updateFilterValue, 
        awardingPublished, 
        setAwardingPublished,
        updateFilterAvailablity
    } = useTendersFilter()
    
    return( 
        <div className="tenders-filter-card  bg-[rgba(200,200,200,0.1)] rounded-md border border-1">
            <div className="p-1 flex justify-between w-full">
                <div className="flex gap-x-4">
                    <div className="flex">
                        <SearchInput
                            className="tenders-search-field"
                            value={search}
                            setValue={setSearch}
                            placeholder="ابحث في المناقصات"
                            searchMode={searchMode}
                            setSearchMode={setSearchMode}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="mx-auto">
                            <select className="add-filter-select" value={'default'}>
                                <option value="default" disabled defaultChecked >حالة المنافسة</option>
                                {
                                    tenderStateList.map((state,index)=>(
                                        <option key={index} value={state}>{state}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="my-auto">
                             نشر الترسية  :      
                        </div>
                        <div 
                            className={`my-auto border border-1 border-gray-300 py-1 px-5 rounded-xl cursor-pointer ${awardingPublished == true ? 'bg-primary-light text-paper':''}`}  
                            onClick={()=>setAwardingPublished(awardingPublished == true ? undefined : true)}    
                        >
                            نعم
                        </div>
                        <div 
                            className={`my-auto border border-1 border-gray-300 py-1 px-5 rounded-xl cursor-pointer ${awardingPublished == false ? 'bg-primary-light text-paper':''}`}
                            onClick={()=>setAwardingPublished(awardingPublished == false ? undefined : false)}   
                        >
                            لا
                        </div>
                    </div>
                    
                </div>

                <div className="flex gap-4">
                    <div className="m-auto">
                        <DropdownMenu>
                            <DropdownMenuTrigger className="outline-none">
                                <div className="add-filter-select">
                                    الفلاتر
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="add-filter-select-content">
                                <DropdownMenuGroup   className="add-filter-select-group">
                                    <DropdownMenuLabel className="text-md text-muted">اختر الفلاتر المطلوبة</DropdownMenuLabel>
                                    {
                                        filters.map(({name,available},index) => (
                                            <DropdownMenuCheckboxItem 
                                                
                                                className={`focus:outline-none cursor-pointer ${available ? "bg-primary-light text-gold-light" : ""}`} 
                                                onClick={e=>{
                                                    e.preventDefault()
                                                            
                                                    updateFilterAvailablity(name,!available)
                                                }} 
                                                key={index} 
                                                checked={available}
                                            >
                                                {name}
                                            </DropdownMenuCheckboxItem>
                                        ))
                                    }
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="flex text-primary cursor-pointer hover:text-gold transition-colors duration-300">
                        <div className="h-full p-0">                
                            <div className="h-full p-0 flex">
                                <FormButton 
                                    varient="default" 
                                    text="بحث" 
                                    className="w-full text-paper px-5 rounded-md text-md hover:bg-primary-light hover:text-gold-light transition-colors duration-300 h-full m-auto"
                                />
                            </div>
                        </div> 
                    </div>
                </div>
            </div>
            <div className="p-1 py-5 flex w-full flex-wrap gap-7 ">
                {
                    filters.map(({name,available,data},index)=>{
                        if(!available) return null;
                        return(
                            <div key={index} className="flex gap-2"> 
                            {
                                data.map(({value,type,param},index)=>(
                                    type == 'text' ? 
                                        <LabeledInput 
                                            label={name} 
                                            type="text" 
                                            inputClassName="input-field"
                                            containerClassName="w-full"
                                            placeholder={name+'...'}
                                            value={value}
                                            setValue={(e)=>updateFilterValue(name,param,e)}
                                        /> :
                                        type == 'date' ? 
                                            <LabeledInput
                                                label={index == 0 ? name : '( الى )'}
                                                type="date"
                                                inputClassName="input-field"
                                                containerClassName="w-full"
                                                value={value}
                                                setValue={(e)=>updateFilterValue(name,param,e)}
                                            /> :
                                            null
                                ))
                            }
                            </div>
                        )
                    })
                }
                {/* {
                    filters.senderId.available && 
                    <div className="flex"> 
                        <LabeledInput 
                            label={filters.senderId.name} 
                            type="text" 
                            inputClassName="input-field"
                            containerClassName="w-full"
                        /> 
                        <div className="flex justify-center items-end py-6 px-1">
                            <XIcon className="text-muted hover:text-error cursor-pointer" onClick={()=>{
                                setFilters(prev=>{
                                        return {
                                            ...prev, senderId:{ ...prev.senderId ,available: !prev.senderId.available}
                                        }
                                    })
                                }}
                                size={20}
                            />
                        </div>
                    </div>
                }
                {
                    filters.awardingPublished.available && 
                    <div> 
                        <LabeledInput 
                            label={filters.awardingPublished.name} 
                            type="text" 
                            inputClassName="input-field"
                            containerClassName="w-full"
                        /> 
                    </div>
                }
                {
                    filters.competitionStatus.available && 
                    <div> 
                        <LabeledInput
                            label={filters.competitionStatus.name}
                            type="text"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.publishDateFrom.available && 
                    <div> 
                        <LabeledInput
                            label={filters.publishDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.publishDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.publishDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                            value={}
                        />
                    </div>
                }
                {
                    filters.inquiriesDeadlineDateFrom.available &&
                    <div>
                        <LabeledInput
                            label={filters.inquiriesDeadlineDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.inquiriesDeadlineDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.inquiriesDeadlineDateTo.name}
                            type="date"
                            inputClassName="input-field"  
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.bid_evaluationDateFrom.available &&
                    <div>
                        <LabeledInput
                            label={filters.bid_evaluationDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.bid_evaluationDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.bid_evaluationDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.expectedAwardDateFrom.available &&
                    <div>
                        <LabeledInput
                            label={filters.expectedAwardDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.expectedAwardDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.expectedAwardDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.workStartDateFrom.available &&
                    <div>
                        <LabeledInput
                            label={filters.workStartDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.workStartDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.workStartDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.questionStartDateFrom.available &&
                    <div>
                        <LabeledInput
                            label={filters.questionStartDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.questionStartDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.questionStartDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.bidSubmissionDeadlineDateFrom.available &&
                    <div>
                        <LabeledInput

                            label={filters.bidSubmissionDeadlineDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.bidSubmissionDeadlineDateTo.available &&
                    <div>
                        <LabeledInput

                            label={filters.bidSubmissionDeadlineDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.bidOpeningDateFrom.available &&
                    <div>
                        <LabeledInput
                            label={filters.bidOpeningDateFrom.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                }
                {
                    filters.bidOpeningDateTo.available &&
                    <div>
                        <LabeledInput
                            label={filters.bidOpeningDateTo.name}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full"
                        />
                    </div>
                } */}
            </div>
        </div>
    )
}