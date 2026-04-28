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
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Aref+Ruqaa:wght@400;700&family=IBM+Plex+Sans+Arabic:wght@100;200;300;400;500;600;700&family=Tajawal:wght@200;300;400;500;700;800;900&display=swap" rel="stylesheet"/>
            </head>
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