
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/navbar";
import { UserProvider } from "../lib/contexts/user-context";
import { ThemeProvider } from "../lib/contexts/theme-context";
import { NoConnection } from "../components/ui/no-connection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gold Pearl Esports - Elite Tournament",
  description: "Join the ultimate gaming tournament. Compete, win, and claim glory.",
  keywords: "esports, tournament, gaming, BGMI, competitive",
  robots: "index, follow",
};

export const viewport = "width=device-width, initial-scale=1, maximum-scale=5";




export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f8f8f8" media="(prefers-color-scheme: light)" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        <NoConnection/>

        <UserProvider>
          <ThemeProvider>
            <Navbar />
            {/* <MatchJoiningForm /> */}
            {children}
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );

}


