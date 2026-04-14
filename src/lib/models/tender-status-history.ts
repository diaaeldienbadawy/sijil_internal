export interface TenderStatusHistory {
  tender_id: string;
  status?: string;
  changed_at?: string;
  [key: string]: unknown;
}