"use client"
import { useState, useEffect } from "react"
import Image from "next/image"

export default function ClientWrapper({ children }) {
  const [isAppLoading, setIsAppLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-r from-[#0B1F2B] via-[#193787] via-[#122E56] to-[#0B1F2B]">
        <div className="animate-pulse duration-1000">
          <Image
            src="/logo-18.png"
            alt="Logo"
            width={1000}
            height={900}
            priority
            className="object-contain"
          />
        </div>
      </div>  
    )
  }

  return <>{children}</>
}
