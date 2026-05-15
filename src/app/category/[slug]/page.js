"use client"
import React, { useState, useEffect } from "react"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import MiniScrollList from "../../components/MiniScrollList"
import Link from "next/link"
import NewsCardList from "../../components/NewsCardList"
import { fetchArticles } from "@/lib/api"

export default function CategoryPage({ params }) {
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug
  const decodedSlug = decodeURIComponent(slug)
  const apiSlug = decodedSlug.replace(/\s+/g, "-").toLowerCase()

  const [categoryNews, setCategoryNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles({ limit: 20, category: apiSlug })
      .then(data => {
        const items = (data?.items || []).map(article => ({
          id: article.id,
          title: article.title,
          category: article.category?.name || decodedSlug.toUpperCase(),
          image: article.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
          date: new Date(article.publishedAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
          content: article.excerpt || article.content?.substring(0, 150) + "...",
        }))
        setCategoryNews(items)
      })
      .catch(err => {
        console.error("Category fetch error:", err)
        setCategoryNews([])
      })
      .finally(() => setLoading(false))
  }, [apiSlug, decodedSlug])

  if (loading) {
    return (
      <main className="bg-white min-h-screen">
        <Navbar />
        <div className="max-w-[1140px] mx-auto py-20 flex justify-center">
          <div className="animate-pulse text-slate-400 font-bold">Memuat berita...</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="bg-white min-h-screen">
      <Navbar />
      <MiniScrollList news={categoryNews} />
      <div className="max-w-[1140px] mx-auto md:px-0">
        {categoryNews.length === 0 ? (
          <div className="py-40 text-center px-4">
            <h1 className="text-xl font-black text-slate-300 uppercase tracking-widest">Belum ada berita di kategori &quot;{decodedSlug}&quot;</h1>
            <Link href="/" className="text-red-600 font-bold underline mt-4 inline-block">Kembali ke Beranda</Link>
          </div>
        ) : (
          <NewsCardList category={decodedSlug} />
        )}
      </div>
      <Footer />
    </main>
  )
}
