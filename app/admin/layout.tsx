import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export const metadata: Metadata = {
  title: "Administration - ClubCersTir",
  description: "Panneau d'administration du club de tir ClubCersTir",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <AdminSidebar />
        </div>

        <div className="md:col-span-3">{children}</div>
      </div>
    </div>
  )
}

