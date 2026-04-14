export interface TenderFieldChange {
  tender_id: string;
  field_name?: string;
  old_value?: string;
  new_value?: string;
  changed_at?: string;
  [key: string]: unknown;
}