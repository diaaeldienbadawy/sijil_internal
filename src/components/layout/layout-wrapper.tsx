'use client'

import { usePathname } from 'next/navigation'
import NavBar from "@/components/layout/navbar/navbar"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname.startsWith('/user')) {
    return (
      <div className="w-full h-full bg-cream flex justify-center">
        <div className="max-w-[1200px] lg:max-w-[1400px] w-full py-[80px]">
          {children}
        </div>
        <NavBar />
      </div>
    )
  }

  return <>{children}</>
}