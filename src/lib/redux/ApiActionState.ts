import { ApiError } from "../api/responses/api-error";

export interface ApiActionState<T> {
    data? : T ;
    isLoading : boolean;
    error?: string;
}

export function getInitialApiState<T> (data?:T): ApiActionState<T> { return ({ data : data, isLoading : false, error : undefined }) }