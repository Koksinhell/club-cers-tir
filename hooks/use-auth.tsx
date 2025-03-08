"use client"

import { useState, useEffect, useContext, createContext } from "react"
import { supabase } from "../utils/supabaseClient"
import { useRouter } from "next/router"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getActiveSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getActiveSession()

    supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
  }, [])

  const signIn = async (email, password) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in:", error)
    }
    setLoading(false)
  }

  const signUp = async (email, password) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      console.error("Error signing up:", error)
    }
    setLoading(false)
  }

  const signOut = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    router.push("/login") // Redirect to login page after sign out
    setLoading(false)
  }

  const checkAuth = async () => {
    const user = supabase.auth.getUser()
    if (!user) {
      router.push("/login")
    } else {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", supabase.auth.currentUser?.id)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
      }

      if (profile) {
        // Mettre à jour les métadonnées de l'utilisateur avec son rôle
        await supabase.auth.updateUser({
          data: {
            role: profile.role,
          },
        })
      }
    }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  return useContext(AuthContext)
}

