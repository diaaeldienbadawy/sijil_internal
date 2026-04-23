import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "../../ui/button";
import { openPopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice";
import AnalysisIframe from "../analysis-ifram/analysis-iframe";
import TenderAnalysis from "../tender-analysis/tender-analysis";

export default function TendersPageHeader(){
    const dispatch = useAppDispatch()
    
    const onDashBoardClick = () => {
        dispatch(openPopoverDialog(<AnalysisIframe/>))
    }

    const onAnalyticsClick = ()=>{
        dispatch(openPopoverDialog(<TenderAnalysis/>))
    }

    return(
        <div className="font-amiri text-primary py-4 flex">
            <h1 className="font-amiri font-bold"  >بوابة المنافسات</h1>
            <div className="flex flex-col justify-end ps-3">
                <Button className="text-cream rounded-md" onClick={onDashBoardClick}>داشبورد</Button>
            </div>
        </div>
    )
}