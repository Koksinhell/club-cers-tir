import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, MessageSquare, PlusCircle, Pin } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { getSession } from "@/lib/supabase-server"

export const revalidate = 60 // Revalidate every minute

interface CategoryPageProps {
  params: {
    id: string
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  const { data: category } = await supabase.from("forum_categories").select("*").eq("id", params.id).single()

  if (!category) {
    notFound()
  }

  const { data: topics } = await supabase
    .from("forum_topics")
    .select(`
      *,
      profiles!forum_topics_author_id_fkey(full_name),
      forum_posts(count)
    `)
    .eq("category_id", params.id)
    .order("pinned", { ascending: false })
    .order("updated_at", { ascending: false })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/forum" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au forum
          </Link>
        </Button>

        {session && (
          <Button asChild>
            <Link href={`/forum/nouveau-sujet?categorie=${category.id}`} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouveau sujet
            </Link>
          </Button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-8">{category.description}</p>

      <div className="space-y-4">
        {topics?.map((topic) => (
          <Card key={topic.id}>
            <CardHeader className="pb-2">
              <Link href={`/forum/sujet/${topic.id}`}>
                <div className="flex items-center gap-2">
                  {topic.pinned && <Pin className="h-4 w-4 text-amber-500" />}
                  <CardTitle className="text-lg hover:text-primary transition-colors">{topic.title}</CardTitle>
                </div>
              </Link>
              <CardDescription>
                Créé par {topic.profiles?.full_name || "Utilisateur"}
                {" • "}
                {formatDistanceToNow(new Date(topic.created_at), {
                  addSuffix: true,
                  locale: fr,
                })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare className="h-4 w-4" />
                <span>
                  {topic.forum_posts?.[0]?.count || 0}{" "}
                  {(topic.forum_posts?.[0]?.count || 0) <= 1 ? "réponse" : "réponses"}
                </span>
                <span className="mx-2">•</span>
                <span>{topic.views} vues</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {(!topics || topics.length === 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun sujet dans cette catégorie pour le moment.</p>
            {session && (
              <Button asChild className="mt-4">
                <Link href={`/forum/nouveau-sujet?categorie=${category.id}`}>Créer le premier sujet</Link>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

