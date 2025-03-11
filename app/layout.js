import { DM_Sans } from "next/font/google";
import "./globals.css";
import {ClerkProvider} from '@clerk/nextjs'
import { Toaster } from "@/components/ui/toaster"

// If loading a variable font, you don't need to specify the font weight
const dm_sans = DM_Sans({
    subsets:["latin"], weight:["400","500","100","200","300","600","700","800","900" ]
})
export const metadata = {
  title: "Tri State Community Services",
  description: "Uncontested Divorce $399",
};

export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
          <html lang="en" className={`min-h-screen h-full text-base funnel-display-400`}>
          <head>
              <link rel="preconnect" href="https://fonts.googleapis.com"/>
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
              <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
                    rel="stylesheet"/>
          </head>
          <body className={`${dm_sans.className} antialiased tracking-tight`}>
          <div  className={` w-full h-full text-[#001A6E] select-none`}>
              {children}
          </div>
          <Toaster/>
          </body>
          </html>
      </ClerkProvider>
  );
}
