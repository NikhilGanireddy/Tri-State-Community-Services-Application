import "./globals.css";
import {
    ClerkProvider,

} from '@clerk/nextjs'
import { Poppins } from 'next/font/google'
import { Toaster } from "@/components/ui/toaster"

// If loading a variable font, you don't need to specify the font weight
const poppins = Poppins({ subsets: ['latin'], weight:["100", "200","300","400","500","600","700","800"] })

export const metadata = {
  title: "Tri State Community Services",
  description: "Created by Nikhil Ganireddy",
};

export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
          <html lang="en" className={`min-h-screen h-full text-base funnel-display-400`}>
          <head>
              <link rel="preconnect" href="https://fonts.googleapis.com"/>
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
              <link href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
                    rel="stylesheet"/>
          </head>
          <body>
          {children}
          <Toaster/>
          </body>
          </html>
      </ClerkProvider>
  );
}
