export interface TenderDates {
  tender_id: string;
  inquiries_deadline_date?: string | null;
  bid_evaluation_date?: string | null;
  expected_award_date?: string | null;
  work_start_date?: string | null;
  questions_start_date?: string | null;
  bid_submission_deadline_at?: string | null;
  bid_opening_at?: string | null;
  stoppage_period_days?: number | null;
  max_inquiry_response_days?: number | null;
  bid_opening_location?: string | null;
}