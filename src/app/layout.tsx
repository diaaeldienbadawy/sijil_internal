import MutatingDots from "@/components/utility/spinners/mutating-dots";
import StoreProvider from "@/lib/redux/store-provider";
import { ReactNode, Suspense } from "react";
import '../styles/globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>){
    return(
        <html lang="ar" className={cn("font-sans", geist.variable)}>
            <body>
                <Suspense fallback={<MutatingDots/>}>
                    <StoreProvider>
                        {children}
                    </StoreProvider>
                </Suspense>
            </body>
        </html>
    )
}