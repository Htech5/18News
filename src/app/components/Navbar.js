"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { fetchCategories } from "@/lib/api"

export default function Navbar() {
  const pathname = usePathname()
  const [navLinks, setNavLinks] = useState([{ name: "TRENDING", href: "/" }])

  useEffect(() => {
    fetchCategories()
      .then(categories => {
        const links = [{ name: "TRENDING", href: "/" }]
        categories.forEach(cat => {
          links.push({ name: cat.name.toUpperCase(), href: `/category/${cat.slug}` })
        })
        setNavLinks(links)
      })
      .catch(() => {
        setNavLinks([
          { name: "TRENDING", href: "/" },
          { name: "POLITIK", href: "/category/politik" },
          { name: "TEKNOLOGI", href: "/category/teknologi" },
          { name: "OLAH RAGA", href: "/category/olah-raga" },
          { name: "HIBURAN", href: "/category/hiburan" }
        ])
      })
  }, [])

  return (
    <nav className="relative w-full bg-gradient-to-r from-[#122E56] via-[#193787] to-[#0B1F3B] shadow-xl overflow-hidden">
      <div className="hidden md:block max-w-7xl mx-auto px-10 pt-4 pb-6 relative">
        <div className="relative flex justify-end items-center h-12 mb-6 w-full">
          <div className="absolute left-[-110px] top-1/2 -translate-y-1/2 z-50">
            <Link href="/" className="hover:opacity-80 transition-all block">
              <img src="/logo-18.png" alt="Logo" className="w-75 h-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]" />
            </Link>
          </div>
          <div className="relative w-80">
            <input type="text" placeholder="" className="w-full bg-white rounded-full py-1 px-5 text-sm text-black outline-none shadow-sm" />
            <div className="absolute right-4 top-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#193787" strokeWidth="3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-40">
          {navLinks.map(link => {
            const seg = pathname.split("/")[2]
            const decoded = seg ? decodeURIComponent(seg) : ""
            const isActive = pathname === link.href || (pathname.startsWith("/category/") && link.href.endsWith(decoded))
            return (
              <Link key={link.name} href={link.href} className={`text-[13px] font-bold tracking-[0.15em] relative py-1 flex flex-col items-center transition-all duration-300 shrink-0 ${isActive ? "text-white" : "text-white/50 hover:text-white"}`}>
                {link.name}
                <div className={`absolute -bottom-3 h-[6px] rounded-full transition-all duration-500 ease-out ${isActive ? "w-18 bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)] opacity-100" : "w-10 bg-blue-400/20 opacity-100"}`} />
              </Link>
            )
          })}
        </div>
      </div>
      <div className="md:hidden flex flex-col w-full">
        <div className="flex justify-between items-center pl-0 pr-4 bg-gradient-to-r from-[#122E56] via-[#193787] to-[#0B1F3B] h-14 relative z-50 shadow-lg gap-2">
          <Link href="/" className="shrink-0"><img src="/logo-18.png" alt="18" className="h-40 w-auto object-contain scale-150 transform origin-left ml-[-90px]" /></Link>
          <div className="relative flex-1 max-w-[280px]">
            <input type="text" placeholder="" className="w-full bg-white rounded-full py-1.5 px-5 text-sm text-black outline-none shadow-inner" />
            <div className="absolute right-4 top-2.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#193787" strokeWidth="3"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg></div>
          </div>
        </div>
        {!pathname.includes("/news/") && (
          <div className="bg-white px-6 py-3 border-b border-slate-100 relative z-10">
            <h1 className={`font-black tracking-tighter text-xl uppercase leading-none ${pathname === "/" ? "text-red-600" : "text-black"}`}>
              {pathname === "/" ? "TRENDING" : decodeURIComponent(pathname.split("/").pop() || "").replace(/-/g, " ")}
            </h1>
          </div>
        )}
      </div>
      <div className="w-full h-[1px] bg-white/10" />
    </nav>
  )
}
