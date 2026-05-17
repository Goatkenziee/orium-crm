import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CRMProvider } from "@/lib/store";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Orium CRM",
  description: "Full-featured CRM for Alexander — powered by Orium AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50`}>
        <CRMProvider>
          <Sidebar />
          <main className="ml-60 min-h-screen flex flex-col">
            {children}
          </main>
        </CRMProvider>
      </body>
    </html>
  );
}
