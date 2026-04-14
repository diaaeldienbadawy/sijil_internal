import { ExecutionPlace } from "./excutionPlace";

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