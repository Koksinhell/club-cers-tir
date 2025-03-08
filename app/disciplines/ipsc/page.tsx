import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "IPSC - ClubCersTir",
  description:
    "Découvrez le tir sportif dynamique IPSC (International Practical Shooting Confederation) au ClubCersTir.",
}

export default function IPSCPage() {
  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">IPSC - Tir Sportif Dynamique</h1>
          <p className="text-muted-foreground">International Practical Shooting Confederation</p>
        </div>

        <Button asChild>
          <Link href="/contact">S'inscrire aux cours</Link>
        </Button>
      </div>

      <div className="relative aspect-[21/9] w-full rounded-lg overflow-hidden mb-8">
        <Image src="/images/ipsc-banner.jpg" alt="IPSC Banner" fill className="object-cover" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Qu'est-ce que l'IPSC ?</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              L'IPSC (International Practical Shooting Confederation) est une discipline de tir dynamique qui combine
              précision, puissance et vitesse. Créée dans les années 1970, cette discipline est aujourd'hui pratiquée
              dans plus de 100 pays à travers le monde.
            </p>
            <p>
              Contrairement au tir de précision traditionnel, l'IPSC se pratique en mouvement, avec des parcours variés
              (appelés "stages") qui mettent à l'épreuve les compétences techniques et tactiques du tireur. Chaque
              parcours est différent et peut comporter des cibles à différentes distances, des obstacles, des
              déplacements et des changements de position.
            </p>
            <p>
              L'IPSC se pratique avec différentes armes : pistolet, carabine, fusil à pompe, et se divise en plusieurs
              divisions selon le type d'arme et les équipements autorisés.
            </p>
            <h3>Les principes de l'IPSC</h3>
            <p>L'IPSC repose sur trois principes fondamentaux, souvent résumés par l'expression "DVC" :</p>
            <ul>
              <li>
                <strong>Diligentia</strong> (Précision) : La capacité à toucher les cibles avec précision
              </li>
              <li>
                <strong>Vis</strong> (Puissance) : L'utilisation d'armes de calibre suffisant pour le tir sportif
              </li>
              <li>
                <strong>Celeritas</strong> (Vitesse) : La rapidité d'exécution des tirs et des déplacements
              </li>
            </ul>
            <p>
              Ces trois éléments sont pris en compte dans le calcul du score final, avec une formule qui équilibre leur
              importance respective.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Équipement</h2>
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/equipment/ipsc-pistol.jpg" alt="Pistolet IPSC" fill className="object-cover" />
            </div>
            <h3 className="text-lg font-medium">Équipement nécessaire</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Arme adaptée à la division choisie</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Holster et porte-chargeurs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Ceinture spécifique</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Protection auditive et oculaire</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span>Munitions en quantité suffisante</span>
              </li>
            </ul>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Divisions principales</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Open</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Standard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Production</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Classic</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Revolver</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Entraînements au club</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Horaires d'entraînement</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex justify-between">
                <span>Mardi</span>
                <span>18h00 - 21h00</span>
              </li>
              <li className="flex justify-between">
                <span>Jeudi</span>
                <span>18h00 - 21h00</span>
              </li>
              <li className="flex justify-between">
                <span>Samedi</span>
                <span>14h00 - 18h00</span>
              </li>
            </ul>
          </div>

          <div className="bg-muted p-6 rounded-lg">
            <h3 className="text-xl font-medium mb-2">Cours et formations</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex justify-between">
                <span>Initiation IPSC</span>
                <span>Samedi 10h00 - 12h00</span>
              </li>
              <li className="flex justify-between">
                <span>Perfectionnement</span>
                <span>Jeudi 18h00 - 20h00</span>
              </li>
              <li className="flex justify-between">
                <span>Préparation compétition</span>
                <span>Mardi 18h00 - 20h00</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Galerie photos</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={`/images/ipsc/gallery-${i}.jpg`}
                alt={`IPSC Gallery ${i}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

