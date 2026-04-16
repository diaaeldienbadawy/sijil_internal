import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { closePopoverDialog } from "@/lib/redux/slices/state_slices/popover-dialog-slice";
import { is } from "date-fns/locale";
import { ReactNode } from "react";

interface Props{
    content:ReactNode
    hasCloseButton:boolean
}

export default function PopoverDialog({content}:Props){
    const state = useAppSelector(s=>s.popoverDialogOpen)
    const dispatch = useAppDispatch()


    const onClose = () => dispatch(closePopoverDialog()) 

    return(
        state.isOpen &&
        <div className="popover-dialog" onClick={onClose}>
            <div className="dialog-card" onClick={(e) => e.stopPropagation()}>
                {content}
            </div>
        </div>
    )
}