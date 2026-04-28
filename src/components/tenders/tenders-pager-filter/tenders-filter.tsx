import LabeledInput from "@/components/form/labeled-input"
import useTendersFilter from "./use-tenders-filter"
import SearchInput from "@/components/form/serach-input"
import FormButton from "@/components/form/from-button"
import { tenderStateList } from "./tender-state-list"
import dayjs from "dayjs"
import { setAwardingPublished, setBidEvaluationDateFrom, setBidEvaluationDateTo, setBidOpeningDateFrom, setBidOpeningDateTo, setBidSubmissionDeadlineDateAvailability, setBidSubmissionDeadlineDateFrom, setBidSubmissionDeadlineDateTo, setCompetitionStatus, setExpectedAwardDateAvailability, setExpectedAwardDateFrom, setExpectedAwardDateTo, setInquiriesDateAvailability, setInquiriesDateFrom, setInquiriesDateTo, setPublishDateAvailability, setPublishDateFrom, setPublishDateTo, setQuestionsStartDateAvailability, setQuestionsStartDateFrom, setQuestionsStartDateTo, setReferenceNumber, setReferenceNumberAvailability, setSearch, setSearchMode, setSenderId, setSenderIdAvailability, setTenderNumber, setTenderNumberAvailability, setWorkStartDateAvailability, setWorkStartDateFrom, setWorkStartDateTo } from "@/lib/redux/slices/state_slices/tender-filter-content-slice"
import FiltersList from "./filters-list"

export default function TendersFilter(){
    const {
        filters,
        searchAction,
        dispatch,
        anyFilterAvailable
    } = useTendersFilter()
    
    return( 
        <div className="tenders-filter-card bg-[rgba(200,200,200,0.1)] rounded-md border border-1">
            <div className="p-1 flex justify-between flex-wrap w-full">
                <div className="flex  gap-4 lg:hidden justify-end w-full ">
                    <div className="">
                        <FiltersList filters={filters}/>
                    </div>
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
                    <div className="flex py-2 w-full md:w-auto flex-col">
                        <SearchInput
                            className="tenders-search-field"
                            value={filters.search.value}
                            setValue={(e)=>dispatch(setSearch(e))}
                            placeholder="ابحث في المناقصات"
                            searchMode={filters.search_mode.value}
                            setSearchMode={(e)=>dispatch(setSearchMode(e))}
                            type="tenders"

                        />
                    </div>
                    <div className="flex  flex-col gap-4 py-2 md:px-2 justify-start w-[100%] md:w-auto">
                        <div className="w-full  h-full">
                            <select className="add-filter-select w-full min-w-[200px]" value={filters.competition_status.value} onChange={(e)=> { dispatch(setCompetitionStatus(e.target.value))}}>
                                <option value="default" disabled defaultChecked >حالة المنافسة</option>
                                {
                                    tenderStateList.map((state,index)=>(
                                        <option key={index} value={state}>{state}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1 py-3 md:px-2 justify-start w-[100%] md:w-auto">
                        <div className="flex gap-2">
                            <div className="my-auto text-nowrap px-2">
                                 نشر الترسية  :      
                            </div>
                            <div 
                                className={`my-auto border border-1 border-gray-300 py-1 px-5 rounded-xl cursor-pointer ${filters.awarding_published.value == true ? 'bg-primary-light text-paper':''}`}  
                                onClick={()=>dispatch(setAwardingPublished(filters.awarding_published.value == true ? undefined : true))}    
                            >
                                نعم
                            </div>
                            <div 
                                className={`my-auto border border-1 border-gray-300 py-1 px-5 rounded-xl cursor-pointer ${filters.awarding_published.value == false ? 'bg-primary-light text-paper':''}`}
                                onClick={()=>dispatch(setAwardingPublished(filters.awarding_published.value == false ? undefined : false))}   
                            >
                                لا
                            </div>
                        </div>
                    </div>
                </div>
                <div className="gap-2 py-2 hidden lg:flex ">
                    <div className="mx-auto">
                        <FiltersList filters={filters}/>            
                    </div>
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
            <div className= {`${anyFilterAvailable ? 'p-1 py-5' : ''}  flex w-full flex-wrap gap-7 `}>
                {
                    filters.sender_id.available && 
                    <div className="flex gap-2">
                        <LabeledInput 
                            label={filters.sender_id.name} 
                            type="text" 
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            placeholder={filters.sender_id.name+'...'}
                            value={filters.sender_id.value}
                            setValue={(e)=>dispatch(setSenderId(e))}
                        /> 
                    </div>     
                }
                {
                    filters.reference_number.available && 
                    <div className="flex gap-2">
                        <LabeledInput 
                            label={filters.reference_number.name} 
                            type="text" 
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            placeholder={filters.reference_number.name+'...'}
                            value={filters.reference_number.value}
                            setValue={(e)=>dispatch(setReferenceNumber(e))}
                        /> 
                    </div>     
                }
                {
                    filters.tender_number.available && 
                    <div className="flex gap-2">
                        <LabeledInput 
                            label={filters.tender_number.name} 
                            type="text" 
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            placeholder={filters.tender_number.name+'...'}
                            value={filters.tender_number.value}
                            setValue={(e)=>dispatch(setTenderNumber(e))}
                        /> 
                    </div>     
                }
                {
                    filters.publish_date.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.publish_date.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.publish_date.from}
                            setValue={(e)=>dispatch(setPublishDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.publish_date.to}
                            setValue={(e)=>dispatch(setPublishDateTo( e))}
                        />
                    </div>     
                }
                {
                    filters.inquiries_deadline_date.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.inquiries_deadline_date.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.inquiries_deadline_date.from}
                            setValue={(e)=>dispatch(setInquiriesDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.inquiries_deadline_date.to}
                            setValue={(e)=>dispatch(setInquiriesDateTo(e))}
                        />
                    </div>     
                }
                {
                    filters.bid_evaluation_date.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.bid_evaluation_date.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.bid_evaluation_date.from}
                            setValue={(e)=>dispatch(setBidEvaluationDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.bid_evaluation_date.to}
                            setValue={(e)=>dispatch(setBidEvaluationDateTo(e))}
                        />
                    </div>     
                }
                {
                    filters.expected_award_date.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.expected_award_date.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.expected_award_date.from}
                            setValue={(e)=>dispatch(setExpectedAwardDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.expected_award_date.to}
                            setValue={(e)=>dispatch(setExpectedAwardDateTo(e))}
                        />
                    </div>     
                }
                {
                    filters.work_start_date.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.work_start_date.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.work_start_date.from}
                            setValue={(e)=>dispatch(setWorkStartDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.work_start_date.to}
                            setValue={(e)=>dispatch(setWorkStartDateTo(e))}
                        />
                    </div>     
                }
                {
                    filters.questions_start_date.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.questions_start_date.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.questions_start_date.from}
                            setValue={(e)=>dispatch(setQuestionsStartDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.questions_start_date.to}
                            setValue={(e)=>dispatch(setQuestionsStartDateTo(e))}
                        />
                    </div>     
                }
                {
                    filters.bid_submission_deadline.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.bid_submission_deadline.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.bid_submission_deadline.from}
                            setValue={(e)=>dispatch(setBidSubmissionDeadlineDateFrom(e))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.bid_submission_deadline.to}
                            setValue={(e)=>dispatch(setBidSubmissionDeadlineDateTo(e))}
                        />
                    </div>     
                }
                {
                    filters.bid_opening.available && 
                    <div className="flex gap-2">
                        <LabeledInput
                            label={filters.bid_opening.name + '( من )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.bid_opening.from}
                            setValue={(e)=>dispatch(setBidOpeningDateFrom({ e: e ? dayjs(e): undefined}))}
                        />
                        <LabeledInput
                            label={ '( الى )'}
                            type="date"
                            inputClassName="input-field"
                            containerClassName="w-full flex flex-col justify-end"
                            value={filters.bid_opening.to}
                            setValue={(e)=>dispatch(setBidOpeningDateTo({ e: e ? dayjs(e): undefined}))}
                        />
                    </div>     
                }
            </div>
        </div>
    )
}