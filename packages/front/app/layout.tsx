import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Header from "../components/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Calamity chats",
  description: "Chat app with muiltiple chat bots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="h-screen w-screen grid grid-rows-[auto_1fr]">
          <Header />
          <div className="overflow-auto">
            <main className="h-full w-full">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
