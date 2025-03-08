import { createServerSupabaseClient } from "@/lib/supabase-server"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Search } from "lucide-react"
import { getSession } from "@/lib/supabase-server"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { ClassifiedFilters } from "@/components/classifieds/classified-filters"
import { AISearch } from "@/components/ai-search"

export const revalidate = 60 // Revalidate every minute

export default async function ClassifiedsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = createServerSupabaseClient()
  const session = await getSession()

  // Parse filters
  const category = searchParams.categorie as string | undefined
  const condition = searchParams.etat as string | undefined
  const minPrice = searchParams.prix_min ? Number.parseInt(searchParams.prix_min as string) : undefined
  const maxPrice = searchParams.prix_max ? Number.parseInt(searchParams.prix_max as string) : undefined

  // Build query
  let query = supabase
    .from("classifieds")
    .select(`
      *,
      profiles(full_name),
      classified_images(url)
    `)
    .eq("status", "active")

  if (category) {
    query = query.eq("category", category)
  }

  if (condition) {
    query = query.eq("condition", condition)
  }

  if (minPrice !== undefined) {
    query = query.gte("price", minPrice)
  }

  if (maxPrice !== undefined) {
    query = query.lte("price", maxPrice)
  }

  const { data: classifieds } = await query.order("created_at", { ascending: false })

  // Get categories for filter
  const { data: categories } = await supabase
    .from("classifieds")
    .select("category")
    .eq("status", "active")
    .order("category")

  const uniqueCategories = Array.from(new Set(categories?.map((item) => item.category)))

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Annonces</h1>

        {session && (
          <Button asChild>
            <Link href="/annonces/nouvelle" className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Nouvelle annonce
            </Link>
          </Button>
        )}
      </div>

      <div className="mb-8">
        <AISearch placeholder="Recherche intelligente (ex: pistolet 9mm en bon état moins de 500€)" route="/annonces" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <ClassifiedFilters categories={uniqueCategories} />
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {classifieds?.map((classified) => (
              <Card key={classified.id} className="overflow-hidden">
                <div className="aspect-square w-full overflow-hidden bg-muted">
                  <img
                    src={classified.classified_images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={classified.title}
                    className="object-cover w-full h-full transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2">{classified.title}</CardTitle>
                    <p className="font-bold text-lg whitespace-nowrap">{classified.price} €</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="outline">{classified.category}</Badge>
                    <Badge variant="secondary">
                      {classified.condition === "new" && "Neuf"}
                      {classified.condition === "like_new" && "Comme neuf"}
                      {classified.condition === "good" && "Bon état"}
                      {classified.condition === "fair" && "État correct"}
                      {classified.condition === "poor" && "État moyen"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{classified.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {classified.profiles?.full_name || "Utilisateur"} •{" "}
                    {formatDistanceToNow(new Date(classified.created_at), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/annonces/${classified.id}`}>Voir l'annonce</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {(!classifieds || classifieds.length === 0) && (
              <div className="col-span-full text-center py-12">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Aucune annonce ne correspond à vos critères.</p>
                <Button asChild variant="outline">
                  <Link href="/annonces">Réinitialiser les filtres</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

