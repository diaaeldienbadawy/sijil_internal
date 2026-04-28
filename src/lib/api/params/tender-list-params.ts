import { TenderSearchMode } from "../../models/tenders/tender-search-mode";

export default interface TenderListParams {
  search?: string;
  search_mode?: TenderSearchMode;
  stender_id?: string;
  reference_number?: string;
  tender_number?: string;
  competition_status?: string;
  awarding_published?: boolean;
  publish_date_from?: string;
  publish_date_to?: string;
  inquiries_deadline_date_from?: string;
  inquiries_deadline_date_to?: string;
  bid_evaluation_date_from?: string;
  bid_evaluation_date_to?: string;
  expected_award_date_from?: string;
  expected_award_date_to?: string;
  work_start_date_from?: string;
  work_start_date_to?: string;
  questions_start_date_from?: string;
  questions_start_date_to?: string;
  bid_submission_deadline_at_from?: string;
  bid_submission_deadline_at_to?: string;
  bid_opening_at_from?: string;
  bid_opening_at_to?: string;
  page?: number;
  limit?: number;
}