import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeScript } from "./theme-script"
import { Toaster } from "@/components/ui/toaster"
import { Inter } from "next/font/google"
import "./globals.css"
import { SupabaseProvider } from "@/lib/supabase-provider"
import { SupabaseErrorBoundary } from "@/components/supabase-error-boundary"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ClubCersTir - Club de Tir Sportif",
  description: "Bienvenue sur le site du club de tir sportif ClubCersTir",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ThemeScript />
          <SupabaseProvider>
            <SupabaseErrorBoundary>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </SupabaseErrorBoundary>
            <Toaster />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'