"use client"

import { useState } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Filter, X } from "lucide-react"

interface ClassifiedFiltersProps {
  categories: string[]
}

export function ClassifiedFilters({ categories }: ClassifiedFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [category, setCategory] = useState<string>(searchParams.get("categorie") || "")
  const [condition, setCondition] = useState<string>(searchParams.get("etat") || "")
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number.parseInt(searchParams.get("prix_min") || "0"),
    Number.parseInt(searchParams.get("prix_max") || "5000"),
  ])

  const applyFilters = () => {
    const params = new URLSearchParams()

    if (category) {
      params.set("categorie", category)
    }

    if (condition) {
      params.set("etat", condition)
    }

    params.set("prix_min", priceRange[0].toString())
    params.set("prix_max", priceRange[1].toString())

    router.push(`${pathname}?${params.toString()}`)
  }

  const resetFilters = () => {
    setCategory("")
    setCondition("")
    setPriceRange([0, 5000])
    router.push(pathname)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="condition">État</Label>
          <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger id="condition">
              <SelectValue placeholder="Tous les états" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les états</SelectItem>
              <SelectItem value="new">Neuf</SelectItem>
              <SelectItem value="like_new">Comme neuf</SelectItem>
              <SelectItem value="good">Bon état</SelectItem>
              <SelectItem value="fair">État correct</SelectItem>
              <SelectItem value="poor">État moyen</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Prix (€)</Label>
            <div className="flex items-center justify-between">
              <Input
                type="number"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([Number.parseInt(e.target.value), priceRange[1]])}
                className="w-20"
              />
              <span className="text-muted-foreground">à</span>
              <Input
                type="number"
                min={priceRange[0]}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                className="w-20"
              />
            </div>
          </div>
          <Slider
            defaultValue={priceRange}
            min={0}
            max={5000}
            step={50}
            value={priceRange}
            onValueChange={(value) => setPriceRange(value as [number, number])}
            className="my-6"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={applyFilters}>Appliquer les filtres</Button>
          <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Réinitialiser
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

