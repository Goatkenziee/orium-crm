import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Orium CRM - Credit Repair Management",
  description: "Manage your credit repair clients efficiently with Orium CRM",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
