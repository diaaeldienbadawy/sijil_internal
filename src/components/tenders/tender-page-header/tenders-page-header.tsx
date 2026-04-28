import { useAppDispatch } from "@/lib/redux/hooks";
import { Button } from "../../ui/button";
import { openPopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice";
import AnalysisIframe from "../analysis-ifram/analysis-iframe";

export default function TendersPageHeader(){
    const dispatch = useAppDispatch()
    
    const onDashBoardClick = () => {
        dispatch(openPopoverDialog(<AnalysisIframe/>))
    }


    return(
        <div className="text-primary py-9 flex">
            <h1 className="font-amiri font-bold"  >بوابة المنافسات</h1>
            <div className="flex flex-col justify-end ps-3" style={{paddingBottom:'5px'}}>
                <Button className="text-primary bg-paper hover:bg-cream rounded-lg px-[20px] text-lg py-6 spin-border-btn" size={'xxl'} variant={'outline'} onClick={onDashBoardClick}>عرض نماذج التحليلات</Button>
            </div>
        </div>
    )
}