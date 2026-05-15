"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchArticles } from "@/lib/api"

export default function NewsCardList({ category, limit }) {
  const [displayNews, setDisplayNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = { limit: limit || 10 }

    if (category && category.toUpperCase() !== "TRENDING") {
      params.category = category.replace(/\s+/g, "-").toLowerCase()
    } else {
      params.isTrending = true
    }

    fetchArticles(params)
      .then(data => {
        const items = (data?.items || []).map(article => ({
          id: article.id,
          title: article.title,
          category: article.category?.name || "BERITA",
          date: new Date(article.publishedAt).toLocaleDateString("id-ID", {
            day: "2-digit", month: "short", year: "numeric"
          }),
          image: article.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
          content: article.excerpt || article.content?.substring(0, 150) + "...",
        }))
        setDisplayNews(items)
      })
      .catch(err => {
        console.error("NewsCardList fetch error:", err)
        setDisplayNews([])
      })
      .finally(() => setLoading(false))
  }, [category, limit])

  if (loading) {
    return (
      <div className="w-full max-w-[1140px] mx-auto pt-8 px-4 md:px-0 mb-10 md:mb-20">
        <div className="flex flex-col gap-6 md:gap-10">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#F1F5F9] rounded-[24px] h-[240px] animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (displayNews.length === 0) {
    return (
      <div className="w-full max-w-[1140px] mx-auto pt-8 px-4 md:px-0 mb-10 md:mb-20 text-center">
        <p className="text-slate-400 font-bold text-sm py-20">Belum ada berita tersedia</p>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1140px] mx-auto pt-8 px-4 md:px-0 mb-10 md:mb-20">
      <div className="flex flex-col gap-6 md:gap-10">
        {displayNews.map(item => (
          <Link href={`/news/${item.id}`} key={item.id} className="group block">
            <div className="hidden md:flex flex-row items-center bg-[#F1F5F9] rounded-[24px] overflow-hidden transition-all duration-300 border border-gray-200/50 hover:shadow-md">
              <div className="w-[349px] h-[240px] shrink-0 overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.title} />
              </div>
              <div className="flex-1 flex flex-col p-8 justify-center">
                <div className="mb-2">
                  <span className="text-red-600 font-bold text-xs uppercase tracking-[0.2em] block">[{item.category}]</span>
                </div>
                <h2 className="text-[24px] leading-[32px] font-black text-[#0B1F2B] group-hover:text-red-600 transition-colors tracking-tight capitalize" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>{item.title}</h2>
                <p className="text-slate-500 text-sm line-clamp-2 mt-3 leading-relaxed font-medium">{item.content}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">{item.date}</span>
                  <div className="w-1 h-1 bg-slate-300 rounded-full mx-1"></div>
                  <span className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Oleh Admin</span>
                </div>
              </div>
            </div>
            <div className="md:hidden flex gap-3 items-center bg-[#F1F5F9] p-2 rounded-[15px] border border-gray-100">
              <div className="w-[146px] h-[90px] shrink-0 rounded-[10px] overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-red-600 font-black text-[8px] uppercase">[{item.category}]</span>
                <h2 className="text-[13px] font-black text-[#0B1F2B] leading-tight line-clamp-2 capitalize">{item.title}</h2>
                <span className="text-slate-400 text-[8px] font-bold uppercase">{item.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
