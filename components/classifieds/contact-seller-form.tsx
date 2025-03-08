"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { Mail, Phone } from "lucide-react"

interface ContactSellerFormProps {
  sellerId: string
  classifiedId: string
}

export function ContactSellerForm({ sellerId, classifiedId }: ContactSellerFormProps) {
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un message.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Vous devez être connecté pour contacter le vendeur.")

      // In a real app, you would send this message to the seller
      // This could be via email, in-app notification, etc.
      // For this example, we'll just simulate success

      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Message envoyé",
        description: "Votre message a été envoyé au vendeur.",
      })

      setMessage("")
      setShowForm(false)
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi du message.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {!showForm ? (
        <div className="space-y-3">
          <Button variant="default" className="w-full flex items-center gap-2" onClick={() => setShowForm(true)}>
            <Mail className="h-4 w-4" />
            Contacter par message
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Voir le numéro
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Votre message au vendeur..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)} disabled={loading}>
              Annuler
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}

