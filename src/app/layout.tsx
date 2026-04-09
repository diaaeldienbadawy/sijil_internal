import MutatingDots from "@/components/utility/spinners/mutating-dots";
import StoreProvider from "@/lib/redux/store-provider";
import { ReactNode, Suspense } from "react";
import '../styles/globals.css';



export default function RootLayout({ children }: Readonly<{ children: ReactNode }>){
    return(
        <html lang="ar">
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