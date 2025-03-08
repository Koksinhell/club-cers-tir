"use client"

import type React from "react"

import { useState } from "react"
import { useSupabase } from "@/lib/supabase-provider"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function CreateAdminPage() {
  const { supabase } = useSupabase()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.fullName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      // Créer l'utilisateur dans Auth
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      })

      if (error) throw error

      if (data.user) {
        // Mettre à jour le profil avec le rôle admin
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            role: "admin",
            membership_status: "active",
          })
          .eq("id", data.user.id)

        if (updateError) throw updateError

        toast({
          title: "Succès",
          description: "Le compte administrateur a été créé avec succès",
        })

        setSuccess(true)
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: `Impossible de créer le compte administrateur: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-12 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Créer un compte administrateur</CardTitle>
          <CardDescription>
            Utilisez ce formulaire pour créer le premier compte administrateur du site. Cette page ne devrait être
            utilisée qu'une seule fois lors de l'initialisation du site.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {success ? (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-600 dark:text-green-400">
                <p className="font-medium">Compte administrateur créé avec succès!</p>
                <p className="text-sm mt-1">
                  Vous pouvez maintenant vous connecter avec l'email et le mot de passe que vous avez fournis.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Le mot de passe doit contenir au moins 8 caractères.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Nom complet</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}
          </CardContent>

          {!success && (
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  "Créer le compte administrateur"
                )}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </div>
  )
}

