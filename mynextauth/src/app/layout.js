// src/app/layout.js

'use client';

// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/header";
import Footer from "../components/Common/Footer";
import { SessionProvider } from "next-auth/react";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Header />
          <main className="flex flex-col items-center justify-center px-6 py-6 min-h-screen bg-gray-50">
            <div className="w-full max-w-7xl flex-auto bg-white rounded-lg shadow-md p-6 sm:p-8 md:p-10">
              {children}
            </div>
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}

