"use client"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import { fetchArticles } from "@/lib/api"

export default function MiniScrollList({ news, isTrending = false, categorySlug }) {
  const scrollRef = useRef(null)
  const [activeMobileId, setActiveMobileId] = useState(null)
  const touchTimer = useRef(null)
  const [miniNews, setMiniNews] = useState(news || [])
  const [loading, setLoading] = useState(!news)

  useEffect(() => {
    if (news && news.length > 0) {
      setMiniNews(news)
      setLoading(false)
      return
    }

    const params = { limit: 10 }
    if (isTrending) params.isTrending = true
    if (categorySlug) params.category = categorySlug

    fetchArticles(params)
      .then(data => {
        const items = (data?.items || []).map(article => ({
          id: article.id,
          title: article.title,
          category: article.category?.name || "BERITA",
          image: article.imageUrl || "https://via.placeholder.com/400x300?text=No+Image",
        }))
        setMiniNews(items)
      })
      .catch(err => {
        console.error("MiniScrollList fetch error:", err)
        setMiniNews([])
      })
      .finally(() => setLoading(false))
  }, [news, isTrending, categorySlug])

  const handleTouchStart = (id) => {
    touchTimer.current = setTimeout(() => setActiveMobileId(id), 400)
  }
  const handleTouchEndOrMove = () => {
    if (touchTimer.current) clearTimeout(touchTimer.current)
    setActiveMobileId(null)
  }
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollTo = direction === "left" ? scrollRef.current.scrollLeft - 400 : scrollRef.current.scrollLeft + 400
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <div className="bg-white w-full">
        <div className="hidden md:block max-w-[1140px] mx-auto pt-10 pb-0 px-0">
          <div className="bg-[#EEF1F5] rounded-[40px] p-12 shadow-sm h-[300px] animate-pulse flex items-center justify-center">
            <span className="text-slate-400 font-bold text-sm">Memuat...</span>
          </div>
        </div>
        <div className="md:hidden w-full flex justify-center py-4">
          <div className="w-[355px] h-[130px] bg-[#EEF1F5] rounded-[15px] animate-pulse"></div>
        </div>
      </div>
    )
  }

  if (miniNews.length === 0) return null

  return (
    <div className="bg-white w-full">
      <div className="hidden md:block max-w-[1140px] mx-auto pt-10 pb-0 px-0">
        <div className="bg-[#EEF1F5] rounded-[40px] p-12 shadow-sm relative overflow-hidden group/list">
          {!isTrending && <div className="absolute top-0 left-0 w-full h-[10px] bg-red-600 z-30"></div>}
          <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 -translate-y-1/2 z-40 px-1 h-full flex items-center justify-center transition-all duration-300 group/btn">
            <svg width="12" height="100" viewBox="0 0 12 100" fill="white" className="drop-shadow-lg opacity-80 group-hover/btn:opacity-100 transition-opacity"><path d="M12 0L0 50L12 100V0Z" /></svg>
          </button>
          <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 -translate-y-1/2 z-40 px-1 h-full flex items-center justify-center transition-all duration-300 group/btn">
            <svg width="12" height="100" viewBox="0 0 12 100" fill="white" className="drop-shadow-lg opacity-80 group-hover/btn:opacity-100 transition-opacity"><path d="M0 0L12 50L0 100V0Z" /></svg>
          </button>
          <div ref={scrollRef} className="flex overflow-x-auto gap-6 no-scrollbar pb-2 snap-x snap-mandatory px-4">
            {miniNews.map(item => (
              <Link key={item.id} href={`/news/${item.id}`} className="flex-none w-[359px] group snap-start flex flex-col gap-3">
                <div className="relative w-[359px] h-[246px] overflow-hidden rounded-[15px] shadow-sm bg-white border-4 border-white">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:brightness-50" />
                  <div className="absolute inset-x-0 bottom-0 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 bg-gradient-to-t from-black/60 to-transparent">
                    <div className="whitespace-nowrap overflow-hidden">
                      <div className="animate-marquee">
                        <span className="text-white font-black text-[14px] md:text-[30px] capitalize tracking-tighter px-4 inline-block">{item.title} &nbsp;&nbsp;&nbsp;&nbsp; {item.title}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden w-full flex justify-center py-4">
        <div className="relative w-[355px] h-[130px]">
          {!isTrending && <div className="absolute left-0 top-[10px] w-[361px] h-[10px] bg-[#D72638] rounded-b-[25px] z-20" style={{ transform: 'matrix(1, 0, 0, -1, 0, 0)' }}></div>}
          <div className="absolute top-[36px] left-1/2 -translate-x-1/2 w-[350px] h-[118px] bg-[#EEF1F5] rounded-[15px] overflow-hidden z-10 shadow-sm border border-slate-100">
            <div className="flex overflow-x-auto h-full items-center gap-3 px-3 no-scrollbar snap-x snap-mandatory">
              {miniNews.map(item => (
                <Link key={item.id} href={`/news/${item.id}`} onTouchStart={() => handleTouchStart(item.id)} onTouchEnd={handleTouchEndOrMove} onTouchMove={handleTouchEndOrMove} onContextMenu={(e) => { if (activeMobileId === item.id) e.preventDefault() }} className="group flex-none w-[180px] h-[100px] snap-start relative overflow-hidden rounded-[10px]">
                  <img src={item.image} alt={item.title} className={`w-full h-full object-cover transition-all duration-300 ${activeMobileId === item.id ? 'scale-110 brightness-50' : 'group-hover:scale-110 group-hover:brightness-50'}`} />
                  <div className={`absolute inset-x-0 bottom-0 py-2 transition-opacity duration-300 pointer-events-none z-20 bg-gradient-to-t from-black/60 to-transparent ${activeMobileId === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    <div className="whitespace-nowrap overflow-hidden">
                      <div className="animate-marquee">
                        <span className="text-white font-black text-[14px] capitalize tracking-tighter px-4 inline-block">{item.title} &nbsp;&nbsp;&nbsp;&nbsp; {item.title}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
