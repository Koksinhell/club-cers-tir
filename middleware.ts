import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Vérifier si l'utilisateur est connecté
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si l'utilisateur n'est pas connecté et essaie d'accéder à une page protégée
  if (!session && req.nextUrl.pathname.startsWith("/admin")) {
    const redirectUrl = new URL("/connexion", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Si l'utilisateur est connecté, vérifier son rôle pour les pages d'administration
  if (session && req.nextUrl.pathname.startsWith("/admin")) {
    // Récupérer le profil de l'utilisateur pour vérifier son rôle
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    // Si l'utilisateur n'est pas administrateur, le rediriger vers la page d'accueil
    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

// Spécifier les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: ["/admin/:path*", "/connexion"],
}

