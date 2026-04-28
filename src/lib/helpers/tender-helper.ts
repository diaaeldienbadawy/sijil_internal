import TenderListParams from "../api/params/tender-list-params";
import { TenderSearchMode } from "../models/tenders/tender-search-mode";
import { FilterContents } from "../models/tenders/filter-content";

export default class TenderHelper{
    static createFiltersString(
        {
            filters,
            page,
            limit
        }:{
            filters:FilterContents,
            page?:number,
            limit?:number
        }): TenderListParams{

        let params: TenderListParams = {
            search:filters.search.value,
            search_mode:filters.search_mode.value?? 'smart',
            awarding_published:filters.awarding_published.value,
            stender_id: filters.sender_id.value,
            reference_number:  filters.reference_number.value,
            tender_number: filters.tender_number.value,
            competition_status: filters.competition_status.value,
            publish_date_from: filters.publish_date.from,
            publish_date_to: filters.publish_date.to,
            inquiries_deadline_date_from: filters.inquiries_deadline_date.from,
            inquiries_deadline_date_to: filters.inquiries_deadline_date.to,
            bid_evaluation_date_from: filters.bid_evaluation_date.from,
            bid_evaluation_date_to: filters.bid_evaluation_date.to,
            expected_award_date_from: filters.expected_award_date.from,
            expected_award_date_to: filters.expected_award_date.to,
            work_start_date_from: filters.work_start_date.from,
            work_start_date_to: filters.work_start_date.to,
            questions_start_date_from: filters.questions_start_date.from,
            questions_start_date_to: filters.questions_start_date.to,
            bid_submission_deadline_at_from: filters.bid_submission_deadline.from,
            bid_submission_deadline_at_to: filters.bid_submission_deadline.to,
            bid_opening_at_from: filters.bid_opening.from,
            bid_opening_at_to: filters.bid_opening.to,
            page: page,
            limit:limit
        };

        return params;
    }
}