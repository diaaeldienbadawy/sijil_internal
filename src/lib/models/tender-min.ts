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