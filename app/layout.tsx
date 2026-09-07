import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import type { FC } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Skinstric",
  description: "Your AI Skin Analysis",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased text-ink`}>
        {children}
      </body>
    </html>
  );
}