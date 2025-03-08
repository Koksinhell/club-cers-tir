import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function EquipmentSection() {
  const equipment = [
    {
      id: "pistol",
      name: "Pistolet de compétition",
      image: "/images/equipment/pistol.jpg",
    },
    {
      id: "rifle",
      name: "Carabine de précision",
      image: "/images/equipment/rifle.jpg",
    },
    {
      id: "protection",
      name: "Protection auditive",
      image: "/images/equipment/protection.jpg",
    },
    {
      id: "targets",
      name: "Cibles homologuées",
      image: "/images/equipment/targets.jpg",
    },
  ]

  return (
    <div className="py-12 bg-muted/50">
      <div className="container">
        <h2 className="text-3xl font-bold mb-2 text-center">Équipements</h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Notre club dispose d'équipements modernes et adaptés à toutes les disciplines de tir sportif.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {equipment.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative aspect-square w-full">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium text-center">{item.name}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

