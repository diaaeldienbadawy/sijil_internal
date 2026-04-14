export interface TenderLocalContentRequirement {
  tender_id: string;
  mechanisms?: string[];
  baseline_min_text?: string | null;
  target_local_content_percent?: number | null;
  note_texts?: string | null;
  note_links?: string | null;
}