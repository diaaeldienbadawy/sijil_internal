import axios, { Axios, AxiosError, AxiosInstance } from 'axios'
import { API_ENDPOINTS } from './endpoints';
import { TokenResponse } from '@/types';
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

    static async get<TResponse>(endPoint : string,{needAuthorization = true,onError}:{needAuthorization?:boolean, onError?:()=>void}) {
            const access_token = await cookieStore.get("access_token")

            const response = await this.createAxios({hasRefreshInterceptor:true}).get(endPoint,
                {
                    withCredentials : true ,
                    headers : 
                    {
                        "Authorization" :  needAuthorization ? `Bearer ${access_token?.value}` : null
                    }
                }
            )

            const responseData:TResponse = await response.data
            return responseData;
    }

    static async post<TData,TResponse>(endPoint:string, {needAuthorization= true,data,onError}:{needAuthorization?:boolean, data:TData, onError?:()=>void}){
            const access_token = await cookieStore.get("access_token")
            const response = await axios.post(endPoint, data,
                {
                    withCredentials:true,
                    headers : 
                    {
                        "Authorization" :  needAuthorization ? `bearer ${access_token?.value}` : null
                    }
                }
            );

            const responseData:TResponse = await response.data
            return responseData;
    }
    static async emptyPost<TResponse>(endPoint:string, {needAuthorization= true,onError}:{needAuthorization?:boolean, onError?:()=>void}){
            const access_token = await cookieStore.get("access_token")
            const response = await axios.post(endPoint, null,
                {
                    withCredentials:true,
                    headers : 
                    {
                        "Authorization" :  needAuthorization ? `bearer ${access_token?.value}` : null
                    }
                }
            );

            const responseData:TResponse = await response.data
            return responseData;
    }

    static async postForm<TData,TResponse>(endPoint:string,{needAuthorization= true,data,onError}:{needAuthorization?:boolean, data:TData, onError?:()=>void}){
            const access_token = await cookieStore.get("access_token")
            
            const response = await axios.postForm(
              endPoint,
              FetchHelper.convertToFormData<TData>(data), 
              {
                headers : 
                {
                    "Authorization" :  needAuthorization ? `bearer ${access_token?.value}` : null
                }
              }
            );

            return response.data as TResponse;
    }
}