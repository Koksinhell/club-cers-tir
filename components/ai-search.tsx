"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

interface AISearchProps {
  placeholder?: string
  route: string
}

export function AISearch({ placeholder = "Rechercher...", route }: AISearchProps) {
  const router = useRouter()
  const { toast } = useToast()

  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setLoading(true)

    try {
      // Utiliser l'AI SDK pour analyser la requête et générer des paramètres de recherche
      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: `
          Analyse cette requête de recherche pour un site d'annonces d'armes et équipements de tir sportif: "${query}"
          
          Extrais les informations suivantes au format JSON:
          - categorie: la catégorie d'équipement (pistolet, carabine, accessoire, etc.)
          - etat: l'état du produit (new, like_new, good, fair, poor)
          - prix_min: prix minimum si mentionné
          - prix_max: prix maximum si mentionné
          
          Si une information n'est pas présente, laisse le champ vide.
          Réponds uniquement avec le JSON, sans texte supplémentaire.
        `,
      })

      // Analyser la réponse JSON
      const searchParams = JSON.parse(text)

      // Construire l'URL avec les paramètres
      const params = new URLSearchParams()

      if (searchParams.categorie) {
        params.set("categorie", searchParams.categorie)
      }

      if (searchParams.etat) {
        params.set("etat", searchParams.etat)
      }

      if (searchParams.prix_min) {
        params.set("prix_min", searchParams.prix_min.toString())
      }

      if (searchParams.prix_max) {
        params.set("prix_max", searchParams.prix_max.toString())
      }

      // Rediriger vers la page de résultats
      router.push(`${route}?${params.toString()}`)
    } catch (error) {
      console.error("Erreur de recherche:", error)
      toast({
        title: "Erreur de recherche",
        description: "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pr-10"
      />
      <Button type="submit" size="icon" variant="ghost" className="absolute right-0 top-0 h-full" disabled={loading}>
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
      </Button>
    </form>
  )
}

