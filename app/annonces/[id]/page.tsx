import { createServerSupabaseClient } from "@/lib/supabase-server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Calendar, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { getSession } from "@/lib/supabase-server"
import { ContactSellerForm } from "@/components/classifieds/contact-seller-form"

export const revalidate = 60 // Revalidate every minute

interface ClassifiedDetailPageProps {
  params: {
    id: string
  }
}

export default async function ClassifiedDetailPage({ params }: ClassifiedDetailPageProps) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  const { data: classified } = await supabase
    .from("classifieds")
    .select(`
      *,
      profiles(id, full_name, avatar_url),
      classified_images(id, url, order)
    `)
    .eq("id", params.id)
    .eq("status", "active")
    .single()

  if (!classified) {
    notFound()
  }

  // Sort images by order
  const sortedImages = [...(classified.classified_images || [])].sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <div className="container py-8">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link href="/annonces" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Retour aux annonces
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h1 className="text-3xl font-bold">{classified.title}</h1>
              <p className="text-3xl font-bold">{classified.price} €</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{classified.category}</Badge>
              <Badge variant="secondary">
                {classified.condition === "new" && "Neuf"}
                {classified.condition === "like_new" && "Comme neuf"}
                {classified.condition === "good" && "Bon état"}
                {classified.condition === "fair" && "État correct"}
                {classified.condition === "poor" && "État moyen"}
              </Badge>
            </div>
          </div>

          {sortedImages.length > 0 ? (
            <div className="space-y-4">
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <img
                  src={sortedImages[0]?.url || "/placeholder.svg?height=400&width=800"}
                  alt={classified.title}
                  className="object-contain w-full h-full"
                />
              </div>

              {sortedImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {sortedImages.slice(1).map((image) => (
                    <div key={image.id} className="aspect-square overflow-hidden rounded-lg bg-muted">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={classified.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
              <p className="text-muted-foreground">Aucune image disponible</p>
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p>{classified.description}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  {classified.profiles?.avatar_url ? (
                    <img
                      src={classified.profiles.avatar_url || "/placeholder.svg"}
                      alt={classified.profiles.full_name || "Vendeur"}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      {(classified.profiles?.full_name || "U").charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{classified.profiles?.full_name || "Utilisateur"}</p>
                  <p className="text-sm text-muted-foreground">Vendeur</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Publiée le {format(new Date(classified.created_at), "dd MMMM yyyy", { locale: fr })}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Localisation: France</span>
                </div>
              </div>

              {session ? (
                <ContactSellerForm sellerId={classified.seller_id} classifiedId={classified.id} />
              ) : (
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">Connectez-vous pour contacter le vendeur</p>
                  <Button asChild className="w-full">
                    <Link href="/connexion">Se connecter</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Conseils de sécurité</h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Ne payez jamais par virement bancaire à l'avance</li>
                <li>• Rencontrez le vendeur dans un lieu public</li>
                <li>• Vérifiez le produit avant de payer</li>
                <li>• Ne communiquez pas vos informations personnelles</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

