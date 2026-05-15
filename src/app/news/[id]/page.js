"use client"
import React, { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { fetchArticleById } from "@/lib/api"

export default function DetailBerita({ params }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    fetchArticleById(id)
      .then(data => setNews(data))
      .catch(err => {
        console.error("Detail fetch error:", err)
        setError("Artikel tidak ditemukan")
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-slate-400 font-bold">Memuat artikel...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !news) {
    return (
      <main className="bg-white min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-slate-400 font-bold text-lg">{error || "Artikel tidak ditemukan"}</p>
          <Link href="/" className="text-red-600 font-bold underline">Kembali ke Beranda</Link>
        </div>
        <Footer />
      </main>
    )
  }

  const formattedDate = new Date(news.publishedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navbar />
      <article className="flex-1 w-full max-w-4xl mx-auto py-8 md:py-12 px-5 md:px-6">
        <div className="max-w-[850px] mx-auto mb-8 md:mb-12">
          <div className="flex items-start gap-4 md:gap-6">
            <button onClick={() => router.back()} className="mt-1 md:mt-1.5 shrink-0 group cursor-pointer">
              <span className="text-2xl md:text-[32px] font-light text-slate-400 group-hover:text-red-600 transition-colors leading-none">&lt;</span>
            </button>
            <div className="flex flex-col gap-4">
              <h1 className="text-[20px] md:text-[32px] leading-tight md:leading-[1.2] font-bold tracking-[0.08em] capitalize text-black" style={{ fontFamily: "var(--font-montserrat), sans-serif" }}>
                {news.isTrending && <span className="text-[#D72638] mr-2">[TRENDING]</span>}
                {news.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                {news.category && (<><span className="text-red-600 text-[10px] md:text-xs font-bold uppercase tracking-widest">{news.category.name}</span><div className="w-1 h-1 bg-slate-300 rounded-full" /></>)}
                <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{formattedDate}</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full" />
                <span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">Oleh Admin</span>
                {news.viewCount > 0 && (<><div className="w-1 h-1 bg-slate-300 rounded-full" /><span className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">{news.viewCount}x dibaca</span></>)}
              </div>
            </div>
          </div>
        </div>
        {news.imageUrl && (
          <div className="w-full h-56 md:h-[500px] rounded-2xl md:rounded-[45px] overflow-hidden shadow-2xl mb-8 md:mb-12">
            <img src={news.imageUrl} className="w-full h-full object-cover" alt={news.title} />
          </div>
        )}
        <div className="prose prose-slate md:prose-xl max-w-none">
          <p className="text-slate-700 text-base md:text-xl leading-relaxed font-medium whitespace-pre-line md:first-letter:text-7xl md:first-letter:font-black md:first-letter:text-red-600 md:first-letter:mr-4 md:first-letter:float-left">{news.content}</p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
