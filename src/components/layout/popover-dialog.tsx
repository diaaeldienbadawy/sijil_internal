import { ReactNode } from "react";

interface Props{
    content:ReactNode
    hasCloseButton:boolean
}

export default function PopoverDialog({content,hasCloseButton}:Props){
    return(
        <div className="popover-dialog">
            <div className="dialog-card">
                {content}
            </div>
        </div>
    )
}