export interface JudgesSearchParams {
  query?: string;
  mode?: 'all' | 'any' | 'exact' | 'exact_number';
  court?: string;
  city?: string;
  year?: string;
  has_appeal?: 'yes' | 'no' | '';
  page?: number;
  per_page?: number;
  sort?: 'newest' | 'oldest';
}