import { AsyncThunk, ThunkDispatch, UnknownAction } from "@reduxjs/toolkit";
import { TokenResponse } from "../responses/token-response";
import { EmptyRequestArgs, PayloadedRequestArgs } from "./request-args";
import { LoginPayload } from "../payload-data/login-payload";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { ApiError } from "../responses/api-error";

export default function useRequest(){
    const dispatch = useAppDispatch()
    const accessTokens = useAppSelector(state=>state.accessTokens)

    function callApi<TData,TResponse>({request,args,platform}:{
       request: AsyncThunk<
         TResponse,
         PayloadedRequestArgs<TData, TResponse>,
         {
           rejectValue: ApiError;
         }
       >,
       args: PayloadedRequestArgs<TData, TResponse>,
       platform?: 'tenders'|'judges'|'updates'
    }
    ) {
        if(platform == 'tenders') args.accessToken = accessTokens.tendersAccessToken
        else if(platform == 'judges') args.accessToken = accessTokens.judgesAccessToken
        else if(platform == 'updates') args.accessToken = accessTokens.updatesAccessToken
        else args.accessToken = ''

        return dispatch(request(args));
    }

    function callEmptyApi<TResponse>({request,args,platform}:{
       request: AsyncThunk<
         TResponse,
         EmptyRequestArgs<TResponse>,
         {
           rejectValue: ApiError;
         }
       >,
       args: EmptyRequestArgs<TResponse>,
       platform?: 'tenders'|'judges'|'updates'
    }
    ) {
        if(platform == 'tenders') args.accessToken = accessTokens.tendersAccessToken
        else if(platform == 'judges') args.accessToken = accessTokens.judgesAccessToken
        else if(platform == 'updates') args.accessToken = accessTokens.updatesAccessToken
        else args.accessToken = ''

        return dispatch(request(args));
    }

    return {callApi,callEmptyApi}
}