import NavBar from "@/components/layout/navbar/navbar";
import PopoverDialog from "@/components/layout/popover-dialog";
import TenderDetails from "@/components/tenders/tender-details/tender-details";
import { ReactNode } from "react";

export default function Layout({children}:{children:ReactNode}){
    return(
        <div className="w-full h-full bg-paper">
            <div className="max-w-lg-[1200px]">
                {children}
            </div>
            <NavBar/>
        </div>
    )
}