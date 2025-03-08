import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"

export async function EventCalendar() {
  const supabase = createServerSupabaseClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("end_date", new Date().toISOString())
    .order("start_date", { ascending: true })
    .limit(5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Événements à venir
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <Link key={event.id} href={`/evenements/${event.id}`} className="block">
                <div className="flex gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                  <div className="flex flex-col items-center justify-center min-w-[3rem] bg-primary/10 text-primary rounded p-1">
                    <span className="text-xs font-medium">
                      {format(new Date(event.start_date), "MMM", { locale: fr })}
                    </span>
                    <span className="text-lg font-bold">{format(new Date(event.start_date), "dd")}</span>
                  </div>
                  <div>
                    <h4 className="font-medium line-clamp-1">{event.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(event.start_date), "HH:mm")} - {format(new Date(event.end_date), "HH:mm")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{event.location}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">Aucun événement à venir.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

