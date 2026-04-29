import { ApiError } from "../responses/api-error"

export interface EmptyRequestArgs<TResponse>{
    onSuccess?:(v?:TResponse)=>void
    onError?:(e?:ApiError)=>void
    accessToken?:string
}

export interface PayloadedRequestArgs<TData,TResponse> extends EmptyRequestArgs<TResponse>{
    data:TData
}