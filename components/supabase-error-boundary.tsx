"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface SupabaseErrorBoundaryProps {
  children: React.ReactNode
}

export function SupabaseErrorBoundary({ children }: SupabaseErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Check if Supabase environment variables are available
    if (
      typeof process.env.NEXT_PUBLIC_SUPABASE_URL !== "string" ||
      typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== "string"
    ) {
      setHasError(true)
    } else {
      setHasError(false)
    }
  }, [])

  if (hasError) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur de configuration</AlertTitle>
          <AlertDescription>
            Les variables d'environnement Supabase sont manquantes ou incorrectes. Veuillez vérifier que
            NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY sont correctement configurées.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}

