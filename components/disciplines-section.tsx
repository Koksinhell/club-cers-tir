import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function DisciplinesSection() {
  const disciplines = [
    {
      id: "ipsc",
      title: "IPSC",
      description:
        "Le tir sportif dynamique IPSC (International Practical Shooting Confederation) combine précision, puissance et vitesse.",
      image: "/images/ipsc.jpg",
      link: "/disciplines/ipsc",
    },
    {
      id: "tsv",
      title: "TSV",
      description:
        "Le Tir Sportif de Vitesse (TSV) est une discipline dynamique française inspirée de l'IPSC avec ses propres règles.",
      image: "/images/tsv.jpg",
      link: "/disciplines/tsv",
    },
    {
      id: "precision",
      title: "Tir de Précision",
      description: "Le tir de précision à 10m, 25m et 50m demande concentration et maîtrise technique.",
      image: "/images/precision.jpg",
      link: "/disciplines/precision",
    },
    {
      id: "plomb",
      title: "Tir à 10m",
      description: "Le tir à 10m (carabine et pistolet à air comprimé) est idéal pour débuter et se perfectionner.",
      image: "/images/plomb.jpg",
      link: "/disciplines/10m",
    },
  ]

  return (
    <div className="py-12">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Nos disciplines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {disciplines.map((discipline) => (
            <Card key={discipline.id} className="overflow-hidden flex flex-col h-full">
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={discipline.image || "/placeholder.svg"}
                  alt={discipline.title}
                  fill
                  className="object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle>{discipline.title}</CardTitle>
                <CardDescription className="line-clamp-2">{discipline.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground">
                  Découvrez cette discipline passionnante pratiquée dans notre club.
                </p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={discipline.link}>En savoir plus</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

