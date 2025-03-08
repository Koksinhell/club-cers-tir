import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Mail, Phone, User, ExternalLink } from "lucide-react"

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées du club</CardTitle>
          <CardDescription>
            Retrouvez toutes les informations pour nous contacter ou nous rendre visite.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Adresse</h3>
              <address className="not-italic text-muted-foreground">
                <p>Club de Tir ClubCersTir</p>
                <p>123 Rue du Stand</p>
                <p>75000 Paris</p>
                <p>France</p>
              </address>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Téléphone</h3>
              <p className="text-muted-foreground">01 23 45 67 89</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">contact@clubcerstir.fr</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Président du club</h3>
              <p className="text-muted-foreground">M. Pierre Durand</p>
              <p className="text-muted-foreground">Tél: 06 12 34 56 78</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium">Horaires d'ouverture</h3>
              <ul className="text-muted-foreground space-y-1">
                <li>Lundi: Fermé</li>
                <li>Mardi: 14h - 19h</li>
                <li>Mercredi: 14h - 19h</li>
                <li>Jeudi: 14h - 19h</li>
                <li>Vendredi: 14h - 19h</li>
                <li>Samedi: 10h - 18h</li>
                <li>Dimanche: 10h - 13h</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan d'accès</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full bg-muted rounded-md overflow-hidden relative">
            <img
              src="/placeholder.svg?height=400&width=600"
              alt="Plan d'accès au club de tir"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">Carte du club</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4 flex items-center gap-2" asChild>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              Ouvrir dans Google Maps
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

