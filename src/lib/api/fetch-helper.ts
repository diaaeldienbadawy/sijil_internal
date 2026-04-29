import axios, { Axios, AxiosError, AxiosInstance } from 'axios'
import { API_ENDPOINTS } from './endpoints';
import { TokenResponse } from './responses/token-response';
import { ApiError } from './responses/api-error';

interface RequestProps<TResponse>{
    accessToken?:string
    onSuccess?: (v?:TResponse) => void
    onError?: (e?:ApiError) => void
    onAxiosError?:(e:AxiosError) => void
}


interface PostRequestProps<TData,TResponse> extends RequestProps<TResponse>{
    data:TData
}



export let tenderAccessToken : string | undefined = undefined
export let judgesAccessToken : string | undefined = undefined
export let updatesAccessToken : string | undefined = undefined
 
export class FetchHelper{
    static createAxios({hasRefreshInterceptor}:{hasRefreshInterceptor:any}):AxiosInstance {
        const instance = axios.create()
        instance.interceptors.response.use(function onFulfilled(response) {
          return response;
        }, async function onRejected(error) {
            if(hasRefreshInterceptor){
                const e = error as AxiosError
                if(e.status == 401){
                    if(e.response?.data ){
                        const data: {detail:string} =  e.response?.data as {detail:string}
                        if(data.detail == "Could not validate credentials"){
                            try{
                                let accessToken = await cookieStore.get("access_token")
                                if(accessToken){
                                    console.log("access_token",accessToken)
                                    const response = await axios.post(
                                        API_ENDPOINTS.AUTH.REFRESH, 
                                        null, 
                                        {
                                            headers:{
                                                "Authorization" : `bearer ${accessToken.value}`
                                            }, 
                                            withCredentials:false
                                        })
                                    
                                    if(response.status >= 200 && response.status <210){
                                        const newToken = (response.data as TokenResponse).access_token
                                        await cookieStore.set("access_token",newToken)
                                        if(e.config){
                                        e.config.headers.Authorization = `bearer ${newToken}`;
                                        
                                        const newResponse = await axios.request({method:e.config?.method , headers:e.config?.headers, url:e.config?.url, data: e.config?.data, withCredentials:e.config?.withCredentials})
                                        return newResponse;
                                        } 
                                    }
                                }
                            }catch(e){
                                return Promise.reject(error);
                            }
                        }
                    }
                }
            }

            return Promise.reject(error);
        })

        return instance;
    }

    static convertToFormData<T>(data: T ): FormData {
      const formData = new FormData();

      Object.entries(data as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      return formData;
    }

    static async get<TResponse>(endPoint : string,{accessToken,onSuccess,onError,onAxiosError}:RequestProps<TResponse>, withCredentials?:boolean) {
        try{
            const response = await this.createAxios({hasRefreshInterceptor:true}).get(endPoint,
                {
                    withCredentials : withCredentials == undefined ? true : withCredentials ,
                    headers : 
                    {
                        "Authorization" :  `Bearer ${accessToken}`
                    }
                }
            )

            const responseData:TResponse = await response.data

            onSuccess?.(response.data)

            return responseData;
        }catch(e){
            const error = e as AxiosError<ApiError>;
            onAxiosError?.(error)
            onError?.(error.response?.data)
            throw e
        }
    }

    static async post<TData,TResponse>(endPoint:string, {accessToken,data,onSuccess,onError,onAxiosError}:PostRequestProps<TData,TResponse>, withCredentials?:boolean){
        try{
            const response = await axios.post(endPoint, data,
                {
                    withCredentials: withCredentials == undefined ? true : withCredentials,
                    headers : 
                    {
                        "Authorization" :  `Bearer ${accessToken}`
                    }
                }
            );

            const responseData:TResponse = await response.data

            onSuccess?.(response.data)

            return responseData;
        }catch(e){
            const error = e as AxiosError<ApiError>;
            onAxiosError?.(error)
            onError?.(error.response?.data)
            throw e
        }
    }
    static async emptyPost<TResponse>(endPoint:string, {accessToken,onSuccess,onError,onAxiosError}:RequestProps<TResponse>, withCredentials?:boolean){
        try{
            const response = await axios.post(endPoint, null,
                {
                    withCredentials: withCredentials == undefined ? true : withCredentials,
                    headers : 
                    {
                        "Authorization" :  `Bearer ${accessToken}`
                    }
                }
            );

            const responseData:TResponse = await response.data

            onSuccess?.(response.data)

            return responseData;
        }catch(e){
            const error = e as AxiosError<ApiError>;
            onAxiosError?.(error)
            onError?.(error.response?.data)
            throw e
        }
    }

    static async postForm<TData,TResponse>(endPoint:string,{accessToken,data,onSuccess,onError,onAxiosError}:PostRequestProps<TData,TResponse>, withCredentials?:boolean){ 
        try{
            const response = await axios.postForm(
              endPoint,
              FetchHelper.convertToFormData<TData>(data), 
              {
                withCredentials: withCredentials == undefined ? true : withCredentials,
                headers : 
                {
                    "Authorization" :  `Bearer ${accessToken}`
                }
              }
            );

            const responseData:TResponse = await response.data

            onSuccess?.(response.data)

            return responseData;
        }catch(e){
            const error = e as AxiosError<ApiError>;
            onAxiosError?.(error)
            onError?.(error.response?.data)
            throw e
        }
    }
}