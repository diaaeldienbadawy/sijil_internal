
export interface ApiActionState<T> {
    data : T | null;
    isLoading : boolean;
    error?: string;
}

export function getInitialApiState<T> (): ApiActionState<T> { return ({ data : null, isLoading : false, error : undefined }) }