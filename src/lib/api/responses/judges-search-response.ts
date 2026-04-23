import { JudgeSearchResult } from "@/lib/models/judges/judge-search-result";

export interface JudgesSearchResponse {
  results: JudgeSearchResult[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  search_terms: string[];
}