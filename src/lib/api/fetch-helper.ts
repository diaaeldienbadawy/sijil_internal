export class FetchHelper{
    static async get<TResponse>(endPoint : string ) {
        const response = await fetch(endPoint,{
            method : 'GET',
            headers : { 
                'Content-Type' : 'application/json'
            },
            credentials : 'include'
        })

        const responseData:TResponse = await response.json()
        return responseData;
    }
    static async post<TData,TResponse>(endPoint:string, {data}:{data:TData}){
        const response = await fetch(endPoint,{
            method : 'POST',
            headers : { 
                'Content-Type' : 'application/json'
            },
            credentials : 'include',
            body:JSON.stringify(data)
        })

        const responseData:TResponse = await response.json()
        return responseData;
    }
}