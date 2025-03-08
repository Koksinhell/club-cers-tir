import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative py-12 md:py-24 overflow-hidden rounded-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-indigo-700/90" />
      <div className="absolute inset-0">
        <Image
          src="/images/hero-shooting.jpg"
          alt="Tir sportif"
          fill
          priority
          className="object-cover object-center"
          style={{ mixBlendMode: "overlay" }}
        />
      </div>
      <div className="relative container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Bienvenue au ClubCersTir</h1>
        <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
          Découvrez notre club de tir sportif, un espace convivial pour les passionnés de toutes les disciplines.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="font-semibold">
            <Link href="/adhesion">Devenir membre</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20 font-semibold"
          >
            <Link href="/a-propos">En savoir plus</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

