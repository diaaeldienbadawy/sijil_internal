import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closePopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice";
import { is } from "date-fns/locale";
import { ReactNode } from "react";


export default function PopoverDialog(){
    const state = useAppSelector(s=>s.popoverDialogOpen)
    const dispatch = useAppDispatch()


    const onClose = () => dispatch(closePopoverDialog())


    return(
        state.isOpen &&
        <div className="popover-dialog flex flex-col justify-center w-[100%] " onClick={onClose}>
            <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
                {state.content}
            </div>
        </div>
    )
}