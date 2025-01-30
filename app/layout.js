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
const poppins = Poppins({ subsets: ['latin'], weight:"400" })

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
      <ClerkProvider>
          <html lang="en" className={`min-h-screen h-full ${poppins.className}`}>
          <body>

          {children}
          </body>
          </html>
      </ClerkProvider>
  );
}
