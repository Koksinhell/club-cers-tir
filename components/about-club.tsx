import { cn } from "@/lib/utils"
import Image from "next/image"

interface AboutClubProps {
  className?: string
}

export function AboutClub({ className }: AboutClubProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-bold">À propos du club</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p>
            Fondé en 1985, ClubCersTir est un club de tir sportif affilié à la Fédération Française de Tir. Notre club
            accueille aussi bien les débutants que les tireurs confirmés dans une ambiance conviviale et sécurisée.
          </p>
          <p>
            Nous disposons d'installations modernes permettant la pratique de différentes disciplines de tir sportif,
            encadrées par des moniteurs diplômés d'État.
          </p>
          <p>
            Nos membres participent régulièrement à des compétitions régionales et nationales dans diverses disciplines
            comme l'IPSC, le TSV et le tir de précision.
          </p>
          <p>
            Rejoignez notre communauté de passionnés et découvrez le tir sportif dans un cadre agréable et sécurisé.
          </p>
        </div>

        <div className="rounded-lg overflow-hidden relative aspect-video">
          <Image src="/images/club-photo.jpg" alt="Club de tir" fill className="object-cover" />
        </div>
      </div>
    </div>
  )
}

