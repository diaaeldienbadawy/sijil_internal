// ============================================================================
// API Types — aligned with actual backend response shapes
// ============================================================================

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;
  is_active: boolean;
  [key: string]: unknown;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type TenderSearchMode = 'smart' | 'phrase' | 'tokens';

export interface TenderMin {
  id: string;
  stender_id?: string;
  details_url?: string;
  reference_number?: string;
  tender_number?: string;
  name: string;
  agency_name?: string;
  tender_type?: string;
  purpose?: string;
  documents_price_sar?: string;
  competition_status?: string;
  remaining_time_text?: string;
  publish_date?: string;
  awarding_published?: boolean;
  local_content_exists?: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenderListResponse {
  items: TenderMin[];
  meta: PageMeta;
}

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

export interface ExecutionRegion { name: string; cities: string[]; }
export interface ExecutionPlace { scope?: string; regions?: ExecutionRegion[]; }

export interface TenderClassification {
  tender_id: string;
  classification_field?: string;
  execution_place?: ExecutionPlace;
  countries?: string[] | null;
  details?: string | null;
  activities?: string[];
  includes_supply_items?: boolean;
  construction_works?: string | null;
  om_works?: string | null;
}

export interface TenderLocalContentRequirement {
  tender_id: string;
  mechanisms?: string[];
  baseline_min_text?: string | null;
  target_local_content_percent?: number | null;
  note_texts?: string | null;
  note_links?: string | null;
}

export interface TenderBidder {
  tender_id: string;
  supplier_name: string;
  financial_offer?: string;
  technical_result?: string;
}

export interface TenderAwarded {
  tender_id: string;
  supplier_name: string;
  financial_offer?: string;
  awarded_value?: string;
}

export interface TenderLocalDoc { tender_id: string; title: string; url: string; }

export interface TenderStatusHistory {
  tender_id: string;
  status?: string;
  changed_at?: string;
  [key: string]: unknown;
}

export interface TenderFieldChange {
  tender_id: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  changed_at?: string;
  [key: string]: unknown;
}

export interface Tender {
  id: string;
  stender_id?: string;
  details_url?: string;
  reference_number?: string;
  tender_number?: string;
  name: string;
  agency_name?: string;
  tender_type?: string;
  purpose?: string;
  documents_price_sar?: string;
  competition_status?: string;
  remaining_time_text?: string;
  contract_duration?: string | null;
  insurance_required?: string | null;
  submission_method?: string;
  preliminary_guarantee?: string;
  preliminary_guarantee_address?: string;
  final_guarantee_percent?: string;
  award_number?: string | null;
  agreement_type?: string | null;
  agreement_duration?: string | null;
  beneficiary_entities?: string | null;
  publish_date?: string;
  awarding_published?: boolean;
  awarding_last_checked_at?: string;
  local_content_exists?: boolean;
  last_change_summary?: string | null;
  created_at: string;
  updated_at: string;
  dates?: TenderDates;
  classification?: TenderClassification;
  local_content_requirement?: TenderLocalContentRequirement;
  bidders?: TenderBidder[];
  awarded?: TenderAwarded[];
  local_docs?: TenderLocalDoc[];
  status_history?: TenderStatusHistory[];
  field_changes?: TenderFieldChange[];
  [key: string]: unknown;
}

export interface TenderListParams {
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

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}
