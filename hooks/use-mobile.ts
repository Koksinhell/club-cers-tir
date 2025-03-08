"use client"

import { useState, useEffect } from "react"

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    if (typeof window !== 'undefined') {
      checkMobile()
      
      window.addEventListener('resize', checkMobile)
      
      return () => window.removeEventListener('resize', checkMobile)
    }
  }, [])

  return isMobile
}

export default useMobile

