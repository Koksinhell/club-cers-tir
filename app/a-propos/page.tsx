import Image from "next/image"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos - ClubCersTir",
  description: "Découvrez l'histoire et les valeurs du club de tir sportif ClubCersTir.",
}

export default function AboutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">À propos de ClubCersTir</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Notre histoire</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p>
              Fondé en 1985 par un groupe de passionnés de tir sportif, ClubCersTir est devenu au fil des années l'un
              des clubs de référence en France pour la pratique du tir sportif dans toutes ses disciplines.
            </p>
            <p>
              Initialement centré sur le tir de précision à 10 mètres, le club s'est progressivement ouvert à d'autres
              disciplines comme le tir à 25 et 50 mètres, puis aux disciplines dynamiques comme l'IPSC (International
              Practical Shooting Confederation) et le TSV (Tir Sportif de Vitesse).
            </p>
            <p>
              Aujourd'hui, ClubCersTir compte plus de 500 membres actifs et dispose d'installations modernes permettant
              la pratique de toutes les disciplines de tir sportif dans les meilleures conditions de sécurité et de
              confort.
            </p>
          </div>
        </div>

        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image src="/images/club-history.jpg" alt="Histoire du club" fill className="object-cover" />
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nos valeurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">Sécurité</h3>
            <p className="text-muted-foreground">
              La sécurité est notre priorité absolue. Tous nos membres sont formés aux règles de sécurité et nos
              installations sont conçues pour garantir une pratique sûre du tir sportif.
            </p>
          </div>

          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">Excellence</h3>
            <p className="text-muted-foreground">
              Nous encourageons nos membres à développer leurs compétences et à viser l'excellence dans leur pratique,
              quel que soit leur niveau initial.
            </p>
          </div>

          <div className="p-6 bg-muted rounded-lg">
            <h3 className="text-xl font-medium mb-2">Convivialité</h3>
            <p className="text-muted-foreground">
              ClubCersTir est avant tout un lieu de rencontre et d'échange entre passionnés. Nous cultivons un esprit de
              camaraderie et d'entraide entre tous nos membres.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Nos installations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="prose dark:prose-invert max-w-none">
              <p>Notre club dispose d'installations modernes et adaptées à toutes les disciplines de tir sportif :</p>
              <ul>
                <li>Stand de tir 10m avec 20 postes électroniques</li>
                <li>Stand de tir 25m avec 10 postes</li>
                <li>Stand de tir 50m avec 8 postes</li>
                <li>Zone de tir dynamique pour l'IPSC et le TSV</li>
                <li>Club-house avec espace détente et restauration</li>
                <li>Armurerie et boutique spécialisée</li>
                <li>Salles de formation et de réunion</li>
              </ul>
              <p>
                Toutes nos installations sont accessibles aux personnes à mobilité réduite et respectent les normes
                environnementales les plus strictes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/facilities/10m.jpg" alt="Stand 10m" fill className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/facilities/25m.jpg" alt="Stand 25m" fill className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/facilities/50m.jpg" alt="Stand 50m" fill className="object-cover" />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image src="/images/facilities/ipsc.jpg" alt="Zone IPSC" fill className="object-cover" />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Notre équipe</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
              <Image src="/images/team/president.jpg" alt="Président" fill className="object-cover" />
            </div>
            <h3 className="text-lg font-medium">Pierre Durand</h3>
            <p className="text-muted-foreground">Président</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
              <Image src="/images/team/secretary.jpg" alt="Secrétaire" fill className="object-cover" />
            </div>
            <h3 className="text-lg font-medium">Marie Laurent</h3>
            <p className="text-muted-foreground">Secrétaire</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
              <Image src="/images/team/treasurer.jpg" alt="Trésorier" fill className="object-cover" />
            </div>
            <h3 className="text-lg font-medium">Jean Moreau</h3>
            <p className="text-muted-foreground">Trésorier</p>
          </div>

          <div className="text-center">
            <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
              <Image src="/images/team/coach.jpg" alt="Entraîneur" fill className="object-cover" />
            </div>
            <h3 className="text-lg font-medium">Sophie Dubois</h3>
            <p className="text-muted-foreground">Entraîneur principal</p>
          </div>
        </div>
      </div>
    </div>
  )
}

