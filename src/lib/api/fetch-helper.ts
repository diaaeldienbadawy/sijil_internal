import axios from 'axios'
export class FetchHelper{
    static convertToFormData<T>(data: T ): FormData {
      const formData = new FormData();

      Object.entries(data as Record<string, any>).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      return formData;
    }

    static async get<TResponse>(endPoint : string, needAuthorization?:boolean , onError?:()=>void) {
        try{
            const access_token = await cookieStore.get("access_token")

            const response = await axios.get(endPoint,
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
        catch(e){
            onError?.()
        }
    }

    static async post<TData,TResponse>(endPoint:string, data:TData, needAuthorization?:boolean, onError?:()=>void){
        try{
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
        }catch(e){
            console.log("error" , e)
            onError?.()
        }
    }

    static async postForm<TData,TResponse>(endPoint:string, data:TData, needAuthorization?:boolean, onError?:()=>void){
        try{
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
        }catch(e){
            console.log("error" , e)
            onError?.()
        }
    }
}