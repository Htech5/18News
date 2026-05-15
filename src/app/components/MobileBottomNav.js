"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { fetchCategories } from "@/lib/api"

const iconMap = {
  "trending": { off: "/icons/trending-off.png", on: "/icons/trending-on.png", short: "TRENDING" },
  "politik": { off: "/icons/politik-off.png", on: "/icons/politik-on.png", short: "POLITIK" },
  "teknologi": { off: "/icons/tekno-off.png", on: "/icons/tekno-on.png", short: "TEKNO" },
  "olah-raga": { off: "/icons/olahraga-off.png", on: "/icons/olahraga-on.png", short: "OLAHRAGA" },
  "hiburan": { off: "/icons/hiburan-off.png", on: "/icons/hiburan-on.png", short: "HIBURAN" },
}

export default function MobileBottomNav() {
  const pathname = usePathname()
  const currentPath = decodeURIComponent(pathname)

  const defaultItems = [
    { name: "TRENDING", href: "/", off: "/icons/trending-off.png", on: "/icons/trending-on.png" },
    { name: "POLITIK", href: "/category/politik", off: "/icons/politik-off.png", on: "/icons/politik-on.png" },
    { name: "TEKNO", href: "/category/teknologi", off: "/icons/tekno-off.png", on: "/icons/tekno-on.png" },
    { name: "OLAHRAGA", href: "/category/olah-raga", off: "/icons/olahraga-off.png", on: "/icons/olahraga-on.png" },
    { name: "HIBURAN", href: "/category/hiburan", off: "/icons/hiburan-off.png", on: "/icons/hiburan-on.png" },
  ]

  const [navItems, setNavItems] = useState(defaultItems)

  useEffect(() => {
    fetchCategories()
      .then(categories => {
        const items = [{ name: "TRENDING", href: "/", off: "/icons/trending-off.png", on: "/icons/trending-on.png" }]
        categories.forEach(cat => {
          const icons = iconMap[cat.slug] || { off: "/icons/trending-off.png", on: "/icons/trending-on.png", short: cat.name.toUpperCase() }
          items.push({ name: icons.short, href: `/category/${cat.slug}`, off: icons.off, on: icons.on })
        })
        setNavItems(items)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 z-[999] py-1 shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center max-w-md mx-auto h-11">
        {navItems.map(item => {
          const isActive = currentPath === item.href
          return (
            <Link key={item.name} href={item.href} className="flex flex-col items-center justify-center gap-1 group">
              <div className={`w-5 h-5 flex items-center justify-center transition-all duration-300 ${isActive ? "scale-110" : "opacity-40"}`}>
                <img src={isActive ? item.on : item.off} alt={item.name} className="w-full h-full object-contain" />
              </div>
              <div className={`h-1.5 rounded-full transition-all duration-500 ${isActive ? "bg-red-600 w-8 shadow-[0_0_10px_rgba(220,38,38,0.6)]" : "bg-transparent w-4"}`} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
