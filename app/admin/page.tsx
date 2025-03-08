"use client"

import type React from "react"

import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSupabase } from "@/lib/supabase-provider"
import { useEffect, useState } from "react"
import { Users, FileText, MessageSquare, Tag, Calendar } from "lucide-react"

export default function AdminDashboard() {
  const { loading, authorized } = useAuth("admin")
  const { supabase } = useSupabase()
  const [stats, setStats] = useState({
    users: 0,
    news: 0,
    topics: 0,
    classifieds: 0,
    events: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true)

        // Récupérer le nombre d'utilisateurs
        const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })

        // Récupérer le nombre d'actualités
        const { count: newsCount } = await supabase.from("news").select("*", { count: "exact", head: true })

        // Récupérer le nombre de sujets de forum
        const { count: topicsCount } = await supabase.from("forum_topics").select("*", { count: "exact", head: true })

        // Récupérer le nombre d'annonces
        const { count: classifiedsCount } = await supabase
          .from("classifieds")
          .select("*", { count: "exact", head: true })

        // Récupérer le nombre d'événements
        const { count: eventsCount } = await supabase.from("events").select("*", { count: "exact", head: true })

        setStats({
          users: usersCount || 0,
          news: newsCount || 0,
          topics: topicsCount || 0,
          classifieds: classifiedsCount || 0,
          events: eventsCount || 0,
        })
      } catch (error) {
        console.error("Erreur lors de la récupération des statistiques:", error)
      } finally {
        setStatsLoading(false)
      }
    }

    if (authorized) {
      fetchStats()
    }
  }, [supabase, authorized])

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!authorized) {
    return <div>Accès non autorisé</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Tableau de bord</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Utilisateurs"
          value={stats.users}
          description="Membres inscrits"
          icon={<Users className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Actualités"
          value={stats.news}
          description="Articles publiés"
          icon={<FileText className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Forum"
          value={stats.topics}
          description="Sujets de discussion"
          icon={<MessageSquare className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Annonces"
          value={stats.classifieds}
          description="Petites annonces"
          icon={<Tag className="h-5 w-5" />}
          loading={statsLoading}
        />

        <StatCard
          title="Événements"
          value={stats.events}
          description="Événements programmés"
          icon={<Calendar className="h-5 w-5" />}
          loading={statsLoading}
        />
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Activité récente</h3>
        <Card>
          <CardHeader>
            <CardTitle>Dernières actions</CardTitle>
            <CardDescription>Historique des dernières actions effectuées sur le site</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">Fonctionnalité en cours de développement</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: number
  description: string
  icon: React.ReactNode
  loading: boolean
}

function StatCard({ title, value, description, icon, loading }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{value}</div>}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

