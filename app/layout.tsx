import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { I18nProvider } from "@/components/i18n-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "TON Provider Explorer",
  description: "Explorer for TON storage providers"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <html lang="ru">
      <body className={inter.className}>
        <I18nProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full px-2 py-6">{children}</main>
            <Footer />
          </div>
        </I18nProvider>
      </body>
    </html>
  )
}
