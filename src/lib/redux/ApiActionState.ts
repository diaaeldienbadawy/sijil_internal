
export interface ApiActionState<T> {
    data? : T ;
    isLoading : boolean;
    error?: string;
}

export function getInitialApiState<T> (): ApiActionState<T> { return ({ data : undefined, isLoading : false, error : undefined }) }