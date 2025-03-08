"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSupabase } from "@/lib/supabase-provider"
import { UserIcon } from "lucide-react"

export function OnlineMembers() {
  const { supabase } = useSupabase()
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    // Subscribe to the online_users channel
    const channel = supabase.channel("online_users")

    // Track presence
    channel
      .on("presence", { event: "sync" }, () => {
        const newState = channel.presenceState()
        setOnlineCount(Object.keys(newState).length)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="h-5 w-5" />
          Membres en ligne
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{onlineCount}</p>
            <p className="text-sm text-muted-foreground">{onlineCount <= 1 ? "membre en ligne" : "membres en ligne"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

