import TenderListParams from "./params/tender-list-params";


const API_URL = process.env.NEXT_PUBLIC_API_URL!;
const API_VER = process.env.NEXT_PUBLIC_API_VER!;

const buildBase = (path: string) => {
  return `${API_URL}${API_VER}${path}`;
}

const withQuery = (path: string, params?: Record<string, string | number | boolean | undefined>): string => {
  const search = new URLSearchParams();

  path = buildBase(path)
  
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined)
      search.append(key, String(value));
  });

  const query = search.toString();
  return query ? `${path}?${query}` : path;
};

export const API_ENDPOINTS = {
    AUTH:{
        LOGIN : buildBase('/auth/token'),
        REFRESH: buildBase('/auth/refresh')
    },
    TENDER:{
      TENDER:(id:string)=>buildBase(`/tenders/${id}`),
      LIST:(params?:TenderListParams) => withQuery('/tenders',params as Record<string, string | number | boolean | undefined> | undefined)
    }
}