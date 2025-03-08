"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

export function ThemeScript() {
  const { setTheme } = useTheme()

  // Exécuté une seule fois au montage du composant
  useEffect(() => {
    // Récupérer le thème depuis localStorage
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark" || savedTheme === "light") {
      // Appliquer le thème sauvegardé s'il existe
      setTheme(savedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Sinon, utiliser les préférences système
      setTheme("dark")
    } else {
      setTheme("light")
    }
    // Ce useEffect ne s'exécute qu'une seule fois au montage
  }, [setTheme])

  return null
}

