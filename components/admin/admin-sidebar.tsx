"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, FileText, MessageSquare, Tag, Calendar, Settings, ShieldAlert } from "lucide-react"

export function AdminSidebar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Tableau de bord",
      href: "/admin",
      icon: <ShieldAlert className="h-4 w-4 mr-2" />,
    },
    {
      name: "Gestion des utilisateurs",
      href: "/admin/utilisateurs",
      icon: <Users className="h-4 w-4 mr-2" />,
    },
    {
      name: "Gestion des actualités",
      href: "/admin/actualites",
      icon: <FileText className="h-4 w-4 mr-2" />,
    },
    {
      name: "Gestion du forum",
      href: "/admin/forum",
      icon: <MessageSquare className="h-4 w-4 mr-2" />,
    },
    {
      name: "Gestion des annonces",
      href: "/admin/annonces",
      icon: <Tag className="h-4 w-4 mr-2" />,
    },
    {
      name: "Gestion des événements",
      href: "/admin/evenements",
      icon: <Calendar className="h-4 w-4 mr-2" />,
    },
    {
      name: "Paramètres du site",
      href: "/admin/parametres",
      icon: <Settings className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <div className="space-y-1">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"}
          className="w-full justify-start"
          asChild
        >
          <Link href={item.href}>
            {item.icon}
            {item.name}
          </Link>
        </Button>
      ))}
    </div>
  )
}

