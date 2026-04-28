import { createSlice } from "@reduxjs/toolkit"
import { FilterContents } from "@/lib/models/tenders/filter-content"
import { TenderSearchMode } from "@/lib/models/tenders/tender-search-mode"


const initialData: FilterContents =  {
    search:{available:true, name:'البحث', param:'search'},
    search_mode:{available: true, name:'طريقة البحث', param:'search_mode'},
    awarding_published:{available:true, name:'نشر الترسية' , param:'awarding_published'},
    sender_id:{available:false, name:'معرف جهة الارسال', param :'sender_id'},
    reference_number:{available:false, name:'رقم المراسلة', param:'reference_number'},
    tender_number:{available:false, name:'رقم المناقصة', param:'tender_number'},
    competition_status:{available:false, name:'حالة المنافسة', param:'competition_status'},
    publish_date:{available:false,name:'تاريخ النشر' , param:'publish_date'},
    inquiries_deadline_date:{available:false, name:'موعد اغلاق الاستفسارات' , param:'inquiries_deadline_date'},
    bid_evaluation_date:{available:false, name:'تاريخ تقييم العروض', param:'bid_evaluation_date'},
    expected_award_date:{available:false, name:'تاريخ التقدير' , param:'expected_award_date'},
    work_start_date:{available:false, name:'تاريخ بداية العمل' , param:'work_start_date'},
    questions_start_date:{available:false, name:'تاريخ بداية الاسئلة' , param:'questions_start_date'},
    bid_submission_deadline:{available:false, name:'موعد تقديم العروض', param:'bid_submission_deadline'},
    bid_opening:{available:false, name:'تاريخ فتح العروض', param:'bid_opening'},
}
            
export const tenderFilterContentSlice = createSlice(
    {
        name:'tender-filter-content', 
        initialState : initialData,
        reducers:{
            setSearch:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,search:{...state.search, value:value}}
            },
            setSearchMode:(state,action)=>{
                const value = action.payload as TenderSearchMode|undefined
                return {...state,search_mode:{...state.search_mode, value:value}}
            },
            setAwardingPublished:(state,action)=>{
                const value = action.payload as boolean|undefined
                return {...state,awarding_published:{...state.awarding_published, value:value}}
            },
            setSenderId:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,sender_id:{...state.sender_id, value:value}}
            },
            setSenderIdAvailability:(state,action)=>{
                console.log("valueueue", action)
                const value = action.payload as boolean
                console.log("valueueue", value)
                if(value) return {...state,sender_id:{...state.sender_id, available:value}}
                else return {...state,sender_id:{...state.sender_id,available:false, value:undefined}}
            },
            setReferenceNumber:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,reference_number:{...state.reference_number, value:value}}
            },
            setReferenceNumberAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,reference_number:{...state.reference_number, available:value}}
                else return {...state,reference_number:{...state.reference_number,available:false, value:undefined}}
            },
            setTenderNumber:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,tender_number:{...state.tender_number, value:value}}
            },
            setTenderNumberAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,tender_number:{...state.tender_number, available:value}}
                else return {...state,tender_number:{...state.tender_number,available:false, value:undefined}}
            },
            setCompetitionStatus:(state,action)=>{

                console.log("actionee ", action.payload)
                const value = action.payload as string|undefined
                return {...state,competition_status:{...state.competition_status, value:value}}
            },
            setCompetitionStatusAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,competition_status:{...state.competition_status, available:value}}
                else return {...state,competition_status:{...state.competition_status,available:false, value:undefined}}
            },
            setPublishDateFrom:(state,action)=>{
                console.log("date dses 5",action.payload)
                const value = action.payload as string|undefined
                return {...state,publish_date:{...state.publish_date, from:value}}
            },
            setPublishDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,publish_date:{...state.publish_date, to:value}}
            },
            setPublishDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,publish_date:{...state.publish_date, available:value}}
                else return {...state,publish_date:{...state.publish_date,available:false,from:undefined , to:undefined}}
            },
            setInquiriesDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,inquiries_deadline_date:{...state.inquiries_deadline_date, from:value}}
            },
            setInquiriesDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,inquiries_deadline_date:{...state.inquiries_deadline_date, to:value}}
            },
            setInquiriesDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,inquiries_deadline_date:{...state.inquiries_deadline_date, available:value}}
                else return {...state,inquiries_deadline_date:{...state.inquiries_deadline_date,available:false,from:undefined , to:undefined}}
            },
            setBidEvaluationDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,bid_evaluation_date:{...state.bid_evaluation_date, from:value}}
            },
            setBidEvaluationDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,bid_evaluation_date:{...state.bid_evaluation_date, to:value}}
            },
            setBidEvaluationDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,bid_evaluation_date:{...state.bid_evaluation_date, available:value}}
                else return {...state,bid_evaluation_date:{...state.bid_evaluation_date,available:false,from:undefined , to:undefined}}
            },
            setExpectedAwardDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,expected_award_date:{...state.expected_award_date, from:value}}
            },
            setExpectedAwardDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,expected_award_date:{...state.expected_award_date, to:value}}
            },
            setExpectedAwardDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,expected_award_date:{...state.expected_award_date, available:value}}
                else return {...state,expected_award_date:{...state.expected_award_date,available:false,from:undefined , to:undefined}}
            },
            setWorkStartDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,work_start_date:{...state.work_start_date, from:value}}
            },
            setWorkStartDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,work_start_date:{...state.work_start_date, to:value}}
            },
            setWorkStartDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,work_start_date:{...state.work_start_date, available:value}}
                else return {...state,work_start_date:{...state.work_start_date,available:false,from:undefined , to:undefined}}
            },
            setQuestionsStartDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,questions_start_date:{...state.questions_start_date, from:value}}
            },
            setQuestionsStartDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,questions_start_date:{...state.questions_start_date, to:value}}
            },
            setQuestionsStartDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,questions_start_date:{...state.questions_start_date, available:value}}
                else return {...state,questions_start_date:{...state.questions_start_date,available:false,from:undefined , to:undefined}}
            },
            setBidSubmissionDeadlineDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,bid_submission_deadline:{...state.bid_submission_deadline, from:value}}
            },
            setBidSubmissionDeadlineDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,bid_submission_deadline:{...state.bid_submission_deadline, to:value}}
            },
            setBidSubmissionDeadlineDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,bid_submission_deadline:{...state.bid_submission_deadline, available:value}}
                else return {...state,bid_submission_deadline:{...state.bid_submission_deadline,available:false,from:undefined , to:undefined}}
            },
            setBidOpeningDateFrom:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,bid_opening:{...state.bid_opening, from:value}}
            },
            setBidOpeningDateTo:(state,action)=>{
                const value = action.payload as string|undefined
                return {...state,bid_opening:{...state.bid_opening, to:value}}
            },
            setBidOpeningDateAvailability:(state,action)=>{
                const value = action.payload as boolean
                if(value) return {...state,bid_opening:{...state.bid_opening, available:value}}
                else return {...state,bid_opening:{...state.bid_opening,available:false,from:undefined , to:undefined}}
            }
        }
    }
)

export const {
    setSearch,
    setSearchMode,
    setSenderId,
    setSenderIdAvailability,
    setReferenceNumber,
    setReferenceNumberAvailability,
    setTenderNumber,
    setTenderNumberAvailability,
    setCompetitionStatus,
    setCompetitionStatusAvailability,
    setAwardingPublished,
    setPublishDateFrom,
    setPublishDateTo,
    setPublishDateAvailability,
    setInquiriesDateFrom,
    setInquiriesDateTo,
    setInquiriesDateAvailability,
    setBidEvaluationDateFrom,
    setBidEvaluationDateTo,
    setBidEvaluationDateAvailability,
    setExpectedAwardDateFrom,
    setExpectedAwardDateTo,
    setExpectedAwardDateAvailability,
    setWorkStartDateFrom,
    setWorkStartDateTo,
    setWorkStartDateAvailability,
    setQuestionsStartDateFrom,
    setQuestionsStartDateTo,
    setQuestionsStartDateAvailability,
    setBidSubmissionDeadlineDateFrom,
    setBidSubmissionDeadlineDateTo,
    setBidSubmissionDeadlineDateAvailability,
    setBidOpeningDateFrom,
    setBidOpeningDateTo,
    setBidOpeningDateAvailability,
} = tenderFilterContentSlice.actions