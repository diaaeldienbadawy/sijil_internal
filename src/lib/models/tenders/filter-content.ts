import { TenderSearchMode } from "../../api/params/tender-search-mode"

export interface FilterContents{
    search : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:string,
    }
    search_mode : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:TenderSearchMode,
    }
    competition_status : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:string,
    }
    awarding_published : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:boolean,
    }
    sender_id : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:string,
    }
    reference_number : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:string,
    }
    tender_number : {
        available:boolean, 
        name:string, 
        param:string, 
        value?:string,
    }
    publish_date : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    inquiries_deadline_date : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    bid_evaluation_date : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    expected_award_date : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    work_start_date : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    questions_start_date : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    bid_submission_deadline : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
    bid_opening : {
        available:boolean, 
        name:string, 
        param:string, 
        from?:string,
        to?:string,
    }
}