import { Tender } from "@/lib/models/tenders/tender";
import TenderListParams from "../params/tender-list-params";
import { FetchHelper } from "../fetch-helper";
import { TenderListResponse } from "../responses/tenders-list-response";
import { API_ENDPOINTS } from "../endpoints";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const getTenderDetailsBatch = createAsyncThunk(
    'get-tender-details-batch',
    async ({ids,batchSize= 10,onProgress}:{
        ids: string[],
        batchSize: number ,
         onProgress?: (fetched: number, total: number) => void}
        ) => await getBatch({ids,batchSize,onProgress})
);

async function getBatch({ids,batchSize = 10,onProgress}:{
  ids: string[],
  batchSize: number,
  onProgress?: (fetched: number, total: number) => void}
): Promise<Tender[]> {
  const results: Tender[] = [];
  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(batch.map(id => getTenderById(id)));
    for (const r of batchResults) {
        if(r != undefined){
            if (r.status === 'fulfilled') results.push(r.value as Tender);
        }
    }
    if (onProgress) onProgress(results.length, ids.length);
  }
  return results;
}

async function getTenderById(id:string){
    return FetchHelper.get<Tender>(API_ENDPOINTS.TENDER.TENDER(id),{needAuthorization:true})
}