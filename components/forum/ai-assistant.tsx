"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bot, Loader2, Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"

export function AIAssistant() {
  const { toast } = useToast()

  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!question.trim()) return

    setLoading(true)
    setAnswer("")

    try {
      const result = streamText({
        model: openai("gpt-4o"),
        prompt: question,
        system: `
          Tu es un assistant spécialisé dans le tir sportif et de loisir.
          Tu réponds aux questions des membres du club de tir ClubCersTir.
          Tes réponses sont précises, informatives et respectent la réglementation française sur les armes.
          Tu ne donnes jamais de conseils qui pourraient être dangereux ou illégaux.
          Tu es poli et professionnel.
        `,
        onChunk: (chunk) => {
          if (chunk.type === "text-delta") {
            setAnswer((prev) => prev + chunk.text)
          }
        },
      })

      await result.text
    } catch (error) {
      console.error("Erreur:", error)
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de la réponse.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Assistant IA du club
        </CardTitle>
      </CardHeader>
      <CardContent>
        {answer ? (
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <p className="whitespace-pre-wrap">{answer}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Posez une question sur le tir sportif, la réglementation, ou les activités du club.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Votre question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            rows={3}
            className="resize-none"
            disabled={loading}
          />
          <Button type="submit" className="w-full flex items-center gap-2" disabled={loading || !question.trim()}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Génération de la réponse...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Envoyer
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

