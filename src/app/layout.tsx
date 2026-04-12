import MutatingDots from "@/components/utility/spinners/mutating-dots";
import StoreProvider from "@/lib/redux/store-provider";
import { ReactNode, Suspense, useEffect, useState } from "react";
import '../styles/globals.css';
import NavBar from "@/components/layout/navbar/navbar";
import { useRouter } from "next/router";
import LayoutWrapper from "@/components/layout/layout-wrapper";



export default function RootLayout({ children }: Readonly<{ children: ReactNode }>){

    return(
        <html lang="ar" dir="rtl">
            <body>
                <Suspense fallback={<MutatingDots/>}>
                    <StoreProvider>
                        <LayoutWrapper>
                            {children}
                        </LayoutWrapper>
                    </StoreProvider>
                </Suspense>
            </body>
        </html>
    )
}