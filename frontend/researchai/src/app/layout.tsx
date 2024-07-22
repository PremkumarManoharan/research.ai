import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Research.ai",
  description:
    "Research.ai: Transforming Reading into Understanding with AI Precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={
          cn(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable
          ) +
          " " +
          inter.className
        }
      >
        {children}
      </body>
    </html>
  );
}
