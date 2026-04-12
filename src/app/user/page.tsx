import NavBar from "@/components/layout/navbar/navbar";
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