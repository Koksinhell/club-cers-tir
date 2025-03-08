import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"

export const revalidate = 3600 // Revalidate every hour

export default async function NewsPage() {
  const supabase = createServerSupabaseClient()

  const { data: news } = await supabase
    .from("news")
    .select(`
      id,
      title,
      content,
      created_at,
      image_url,
      profiles(full_name)
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Actualités</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news?.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.image_url && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={item.image_url || "/placeholder.svg?height=200&width=400"}
                  alt={item.title}
                  className="object-cover w-full h-full transition-transform hover:scale-105"
                />
              </div>
            )}
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-2">{item.title}</CardTitle>
              <CardDescription>
                {formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
                {" • "}
                {item.profiles?.full_name || "Admin"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">{item.content.replace(/<[^>]*>/g, "")}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button asChild variant="outline" size="sm">
                <Link href={`/actualites/${item.id}`}>Lire la suite</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}

        {(!news || news.length === 0) && (
          <div className="col-span-3 text-center py-12">
            <p className="text-muted-foreground">Aucune actualité pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}

