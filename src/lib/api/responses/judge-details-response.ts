import { JudgmentDetail } from "@/lib/models/judges/judgement-details";

export interface JudgeDetailsResponse{
  url: string;
  has_initial: boolean;
  has_appeal: boolean;
  is_appeal_only: boolean;
  initial_judgment: JudgmentDetail;
  appeal_judgment?: JudgmentDetail;
}