import { PageMeta } from "@/lib/models/tenders/page-meta";
import { TenderMin } from "@/lib/models/tenders/tender-min";

export interface TenderListResponse {
  items: TenderMin[];
  meta: PageMeta;
}