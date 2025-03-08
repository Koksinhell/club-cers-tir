import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowLeft, Flag, Lock } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { getSession } from "@/lib/supabase-server"
import { ReplyForm } from "@/components/forum/reply-form"

export const revalidate = 60 // Revalidate every minute

interface TopicPageProps {
  params: {
    id: string
  }
}

export default async function TopicPage({ params }: TopicPageProps) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  // Increment view count
  if (session) {
    await supabase.rpc("increment_topic_views", { topic_id: params.id })
  }

  const { data: topic } = await supabase
    .from("forum_topics")
    .select(`
      *,
      profiles!forum_topics_author_id_fkey(id, full_name, avatar_url, created_at),
      forum_categories(name)
    `)
    .eq("id", params.id)
    .single()

  if (!topic) {
    notFound()
  }

  const { data: posts } = await supabase
    .from("forum_posts")
    .select(`
      *,
      profiles(id, full_name, avatar_url, created_at)
    `)
    .eq("topic_id", params.id)
    .order("created_at", { ascending: true })

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href={`/forum/categorie/${topic.category_id}`} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour à {topic.forum_categories?.name}
        </Link>
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {topic.title}
          {topic.locked && <Lock className="inline-block ml-2 h-5 w-5 text-muted-foreground" />}
        </h1>

        {session && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/forum/signaler?id=${topic.id}&type=topic`} className="flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Signaler
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* First post (topic) */}
        <Card>
          <CardHeader className="flex flex-row items-start gap-4 pb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={topic.profiles?.avatar_url || undefined}
                alt={topic.profiles?.full_name || "Utilisateur"}
              />
              <AvatarFallback>{topic.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <p className="font-medium">{topic.profiles?.full_name || "Utilisateur"}</p>
                  <p className="text-xs text-muted-foreground">
                    Membre depuis{" "}
                    {format(new Date(topic.profiles?.created_at || topic.created_at), "MMMM yyyy", { locale: fr })}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(topic.created_at), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* This would be the first post content, but it's not in the database structure */}
            <p className="text-muted-foreground italic">[Contenu du sujet initial]</p>
          </CardContent>
          <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>Vues: {topic.views}</span>
              <span className="mx-1">•</span>
              <span>Réponses: {posts?.length || 0}</span>
            </div>
          </CardFooter>
        </Card>

        {/* Replies */}
        {posts?.map((post) => (
          <Card key={post.id} id={`post-${post.id}`}>
            <CardHeader className="flex flex-row items-start gap-4 pb-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={post.profiles?.avatar_url || undefined}
                  alt={post.profiles?.full_name || "Utilisateur"}
                />
                <AvatarFallback>{post.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <p className="font-medium">{post.profiles?.full_name || "Utilisateur"}</p>
                    <p className="text-xs text-muted-foreground">
                      Membre depuis{" "}
                      {format(new Date(post.profiles?.created_at || post.created_at), "MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
            <CardFooter className="border-t pt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                {session && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/forum/signaler?id=${post.id}&type=post`} className="flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Signaler
                    </Link>
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}

        {/* Reply form */}
        {session && !topic.locked ? (
          <ReplyForm topicId={topic.id} />
        ) : topic.locked ? (
          <Card className="p-4 text-center text-muted-foreground">
            <Lock className="h-5 w-5 mx-auto mb-2" />
            <p>Ce sujet est verrouillé et n'accepte plus de nouvelles réponses.</p>
          </Card>
        ) : (
          <Card className="p-4 text-center">
            <p className="text-muted-foreground mb-2">Vous devez être connecté pour répondre.</p>
            <Button asChild>
              <Link href="/connexion">Se connecter</Link>
            </Button>
          </Card>
        )}
      </div>
    </div>
  )
}

