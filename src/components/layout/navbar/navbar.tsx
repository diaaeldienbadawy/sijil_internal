"use client";
import { Backpack, BanknoteIcon, CheckIcon, List, ListCheck, LogOut, LucideBanknote, LucideBanknoteX, LucideLogOut, LucidePaperclip, Paperclip, PartyPopper } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar(){
    const router = useRouter()
    const pathname = usePathname()

    const onTabClick = (path:string) => {
        router.push(path)
    }

    const onLogout = async () => { 
        await cookieStore.delete('access_token')
        router.push('/login')
    }

    // const activeTabStyle = "p-2 px-3 bg-gold-light text-primary border-cream border border-2 rounded-2xl flex"
    // const inactiveTabStyle = "p-2 px-3 bg-cream-light rounded-lg flex"

    return(
        <div className="navbar-container">
            <div className="navbar">
                <div className={pathname === '/user/tenders' ? 'active-tab' : 'inactive-tab'} onClick={()=>onTabClick('/user/tenders')}>
                    <ListCheck className="m-auto"/>
                    <div className="nav-page-name">المناقصات</div>
                </div>
                <div className={pathname === '/user/cases' ? 'active-tab' : 'inactive-tab'} onClick={()=>onTabClick('/user/cases')}>
                    <Paperclip className="m-auto"/>
                    <div className="nav-page-name">الاحكام</div>
                </div>
                <div className="w-[20px] p-2">
                    <div className="border-1 border border-gold-light h-[100%] w-[1px]"></div>
                </div>
                <div className="p-2 px-3 bg-cream-light rounded-lg flex"  onClick={()=>onLogout()}>
                    <LucideLogOut className="rotate-180 m-auto"/>
                    <div className="nav-page-name">تسجيل خروج</div>
                </div>
            </div>
        </div>
    )
}