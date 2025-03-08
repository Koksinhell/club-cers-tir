"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/hooks/use-toast"

interface ReplyFormProps {
  topicId: string
}

export function ReplyForm({ topicId }: ReplyFormProps) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const { toast } = useToast()

  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast({
        title: "Erreur",
        description: "Le contenu de la réponse ne peut pas être vide.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Vous devez être connecté pour répondre.")

      const { error } = await supabase.from("forum_posts").insert({
        content: content,
        author_id: user.id,
        topic_id: topicId,
      })

      if (error) throw error

      // Update the topic's updated_at timestamp
      await supabase.from("forum_topics").update({ updated_at: new Date().toISOString() }).eq("id", topicId)

      toast({
        title: "Réponse publiée",
        description: "Votre réponse a été publiée avec succès.",
      })

      setContent("")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de la publication de votre réponse.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Répondre</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Votre réponse..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="resize-y"
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? "Publication..." : "Publier"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

