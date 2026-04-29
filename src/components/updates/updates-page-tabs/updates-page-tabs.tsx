import ReactiveTabs from "@/components/form/reactive-tabs";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { changeCurrentPageTab } from "@/lib/redux/slices/state_slices/current-page-tab-slice";
import { useEffect, useState } from "react";

export default function UpdatesPageTabs(){
    const currentPageTab = useAppSelector(s=>s.currentPageTab)

    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(changeCurrentPageTab('companies'))
    },[])

    return(
        <div>
            <ReactiveTabs
                value={currentPageTab??''}
                onChange={(e)=>dispatch(changeCurrentPageTab(e))}
                tabs={[
                    { name : 'الشركات' , value: 'companies'},
                    { name : 'التحديثات' , value: 'updates'}
                ]}
                styles={{
                    fontSize:22,
                    borderBottomWidth:4
                }}
            />
        </div>
    )
}