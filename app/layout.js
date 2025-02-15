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
          <html lang="en" className={`min-h-screen h-full text-sm ${poppins.className}`}>
          <body>
          {children}
          <Toaster/>
          </body>
          </html>
      </ClerkProvider>
  );
}
