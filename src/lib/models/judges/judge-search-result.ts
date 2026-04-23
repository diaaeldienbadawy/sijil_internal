import { JudgmentSummary } from "./judgment-summary";

export interface JudgeSearchResult {
  index: number;
  url: string;
  initial_judgment: JudgmentSummary;
  has_appeal: boolean;
  has_initial: boolean;
  appeal_date: string | null;
  is_appeal_only: boolean;
}