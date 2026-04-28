"use client";

import { motion } from "framer-motion";
import { ListCheck, Paperclip, LucideLogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { path: "/user/tenders", label: "المناقصات", icon: ListCheck },
    { path: "/user/judges", label: "الاحكام", icon: Paperclip },
  ];

  const logout = async ()=>{
    router.push("/auth/login")
  }

  return (
    <div className="navbar-container">
      <div className="navbar">
        {tabs.map((tab) => {
          const isActive = pathname === tab.path;
          const Icon = tab.icon;

          return (
            <div
              key={tab.path}
              onClick={() => router.push(tab.path)}
              className="relative flex items-center px-3 py-2 cursor-pointer"
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-gold-light border-2 border-cream rounded-full"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              <Icon className="relative z-10 m-auto" />
              <div className="nav-page-name relative z-10">
                {tab.label}
              </div>
            </div>
          );
        })}

        {/* divider */}
        <div className="w-[1px] bg-gold-light mx-2" />

        {/* logout */}
        <div
          onClick={logout}
          className="flex items-center px-3 py-2 rounded-full bg-cream-light"
        >
          <LucideLogOut className="rotate-180 m-auto" />
          <div className="nav-page-name">تسجيل خروج</div>
        </div>
      </div>
    </div>
  );
}