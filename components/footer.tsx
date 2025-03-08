import Link from "next/link"
import { Certifications } from "./certifications"
import { Logo } from "./logo"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <Certifications />

      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <Logo className="mb-2" />
            <p className="text-sm text-muted-foreground">
              Club de tir sportif affilié à la Fédération Française de Tir.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-sm text-muted-foreground hover:text-foreground">
                  Actualités
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-sm text-muted-foreground hover:text-foreground">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/annonces" className="text-sm text-muted-foreground hover:text-foreground">
                  Annonces
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Disciplines</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/disciplines/ipsc" className="text-sm text-muted-foreground hover:text-foreground">
                  IPSC
                </Link>
              </li>
              <li>
                <Link href="/disciplines/tsv" className="text-sm text-muted-foreground hover:text-foreground">
                  TSV
                </Link>
              </li>
              <li>
                <Link href="/disciplines/precision" className="text-sm text-muted-foreground hover:text-foreground">
                  Tir de précision
                </Link>
              </li>
              <li>
                <Link href="/disciplines/10m" className="text-sm text-muted-foreground hover:text-foreground">
                  Tir à 10m
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Contact</h3>
            <address className="not-italic text-sm text-muted-foreground">
              <p>123 Rue du Stand</p>
              <p>75000 Paris</p>
              <p>France</p>
              <p className="mt-2">contact@clubcerstir.fr</p>
              <p>01 23 45 67 89</p>
            </address>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ClubCersTir. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}

