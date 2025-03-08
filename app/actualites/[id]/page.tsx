import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export const revalidate = 3600 // Revalidate every hour

interface NewsDetailPageProps {
  params: {
    id: string
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const supabase = createServerSupabaseClient()

  const { data: news } = await supabase
    .from("news")
    .select(`
      *,
      profiles(full_name)
    `)
    .eq("id", params.id)
    .eq("published", true)
    .single()

  if (!news) {
    notFound()
  }

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/actualites" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux actualités
        </Link>
      </Button>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{news.title}</h1>

        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <span>{format(new Date(news.created_at), "dd MMMM yyyy", { locale: fr })}</span>
          <span className="mx-2">•</span>
          <span>{news.profiles?.full_name || "Admin"}</span>
        </div>

        {news.image_url && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img src={news.image_url || "/placeholder.svg"} alt={news.title} className="w-full h-auto" />
          </div>
        )}

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </article>
    </div>
  )
}

