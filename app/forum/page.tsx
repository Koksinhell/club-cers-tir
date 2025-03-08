import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MessageSquare, PlusCircle } from "lucide-react"
import { getSession } from "@/lib/supabase-server"
import { AIAssistant } from "@/components/forum/ai-assistant"

export const revalidate = 60 // Revalidate every minute

export default async function ForumPage() {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  const { data: categories } = await supabase
    .from("forum_categories")
    .select(`
      *,
      forum_topics(count)
    `)
    .order("order", { ascending: true })

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Forum</h1>

        {session && (
          <Button asChild>
            <Link href="/forum/nouveau-sujet" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouveau sujet
            </Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="space-y-6">
            {categories?.map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-2">
                  <Link href={`/forum/categorie/${category.id}`}>
                    <CardTitle className="text-xl hover:text-primary transition-colors">{category.name}</CardTitle>
                  </Link>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>
                      {category.forum_topics?.[0]?.count || 0}{" "}
                      {(category.forum_topics?.[0]?.count || 0) <= 1 ? "sujet" : "sujets"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}

            {(!categories || categories.length === 0) && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune catégorie de forum pour le moment.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <AIAssistant />
        </div>
      </div>
    </div>
  )
}

