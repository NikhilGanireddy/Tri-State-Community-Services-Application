import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs'
import { Poppins } from 'next/font/google'

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
          </body>
          </html>
      </ClerkProvider>
  );
}
