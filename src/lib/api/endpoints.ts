import NumbersHelper from "../helpers/numbers-helper";
import { CompaniesListParams } from "./params/companies-list-params";
import { JudgesSearchParams } from "./params/judges-search-params";
import TenderListParams from "./params/tender-list-params";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_VER = process.env.NEXT_PUBLIC_API_VER!;

const buildBase = (path: string, platform?:'judge'|'updates' ) => {
  if(platform == 'judge') return `http://127.0.0.1:5050/api${path}`;

  if(platform == 'updates') return `http://172.16.102.106:8000/api${path}`; 

  return `${API_URL}${API_VER}${path}`;
}

const withQuery = (path: string,{params, platform} : { params?: Record<string, string | number | boolean | undefined> , platform?:'judge'|'updates'}): string => {
  const search = new URLSearchParams();

  path = buildBase(path,platform)
  
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value != undefined) search.append(key, NumbersHelper.toEnglishDigits(String(value)));
  });

  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

export const API_ENDPOINTS = {
    AUTH:{
      LOGIN : buildBase('/auth/token'),
      REFRESH: buildBase('/auth/refresh')
    },
    UPDATES_AUTH:{
      LOGIN : buildBase('/auth/login','updates'),
    },
    TENDER:{
      TENDER:(id:string)=>buildBase(`/tenders/${id}`),
      LIST:(params?:TenderListParams) => withQuery('/tenders',{params :params as Record<string, string | number | boolean | undefined> | undefined })
    },
    JUDGES :{
      Filters: buildBase('/filters','judge'),
      JUDGEMENT:(caseIndex:number)=>buildBase(`/detail?index=${caseIndex}`,'judge'),
      LIST : (params?:JudgesSearchParams) => withQuery('/search',{params : params as Record<string, string | number | boolean | undefined> | undefined , platform:'judge'})
    },
    UPDATES : {
      LIST:(params?:CompaniesListParams) => withQuery('/companies',{params :params as Record<string, string | number | boolean | undefined> | undefined , platform:'updates'})
    }
}