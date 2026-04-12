import { Backpack, BanknoteIcon, CheckIcon, List, ListCheck, LogOut, LucideBanknote, LucideBanknoteX, LucideLogOut, LucidePaperclip, Paperclip, PartyPopper } from "lucide-react";

export default function NavBar(){
    return(
        <div className="fixed top-0 w-full flex justify-center p-2">
            <div className="custom-nav-bar bg-paper text-primary shadow shadow-[rgba(100,100,100,0.3)] rounded-r-3xl gap-2 rounded-l-3xl flex px-2 py-1">
                <div className="p-2 px-3 bg-gold-light text-primary border-cream border border-2 rounded-2xl flex">
                    <ListCheck className="m-auto"/>
                    <div className="nav-page-name">المناقصات</div>
                </div>
                <div className="p-2 px-3 bg-cream-light rounded-lg flex">
                    <Paperclip className="m-auto"/>
                    <div className="nav-page-name">الاحكام</div>
                </div>
                <div className="w-[20px] p-2">
                    <div className="border-1 border border-gold-light h-[100%] w-[1px]"></div>
                </div>
                <div className="p-2 px-3 bg-cream-light rounded-lg flex">
                    <LucideLogOut className="rotate-180 m-auto"/>
                    <div className="nav-page-name">تسجيل خروج</div>
                </div>
            </div>
        </div>
    )
}