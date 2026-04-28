'use client'

import { usePathname } from 'next/navigation'
import NavBar from "@/components/layout/navbar/navbar"
import PopoverDialog from './popover-dialog'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/user')) {
    return (
      <div className="w-full h-[100%] bg-cream flex justify-center overflow-auto py-[60px] header-bg">
        <div className="max-w-[1400px] px-2 w-full" style={{zIndex:1}}>
          <PopoverDialog />
    
                    {children}

        </div>
        <NavBar />
      </div>
    )
  }

  return <>{children}</>
}