import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import Link from "next/link"

export function Unauthorized() {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <ShieldAlert className="h-12 w-12 text-destructive" />
        </div>
        <CardTitle className="text-center">Accès non autorisé</CardTitle>
        <CardDescription className="text-center">
          Vous n'avez pas les autorisations nécessaires pour accéder à cette page.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground">
          Cette section est réservée aux administrateurs du site. Si vous pensez qu'il s'agit d'une erreur, veuillez
          contacter un administrateur.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild>
          <Link href="/">Retour à l'accueil</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

