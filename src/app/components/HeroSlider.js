"use client"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { fetchArticles } from "@/lib/api"

export default function HeroSlider() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles({ limit: 5, isTrending: true })
      .then(data => {
        const items = (data?.items || []).map(article => ({
          id: article.id,
          title: article.title,
          url: article.imageUrl || "https://via.placeholder.com/1200x600?text=No+Image",
          category: article.category?.name || "TRENDING"
        }))
        setSlides(items)
      })
      .catch(err => {
        console.error("HeroSlider fetch error:", err)
        setSlides([])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-white pt-4 pb-0 md:pt-10 md:pb-4 px-4 w-full flex justify-center">
        <div className="relative w-[355px] h-[261px] md:w-full md:max-w-[1140px] md:h-[580px] bg-[#EEF1F5] rounded-[25px] md:rounded-[40px] shadow-sm border border-slate-200 flex items-center justify-center animate-pulse">
          <span className="text-slate-400 font-bold text-sm">Memuat berita...</span>
        </div>
      </div>
    )
  }

  if (slides.length === 0) {
    return (
      <div className="bg-white pt-4 pb-0 md:pt-10 md:pb-4 px-4 w-full flex justify-center">
        <div className="relative w-[355px] h-[261px] md:w-full md:max-w-[1140px] md:h-[580px] bg-[#EEF1F5] rounded-[25px] md:rounded-[40px] shadow-sm border border-slate-200 flex items-center justify-center">
          <span className="text-slate-400 font-bold text-sm">Belum ada berita trending</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white pt-4 pb-0 md:pt-10 md:pb-4 px-4 w-full flex justify-center">
      <div className="relative w-[355px] h-[261px] md:w-full md:max-w-[1140px] md:h-[580px] bg-[#EEF1F5] rounded-[25px] md:rounded-[40px] shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-center overflow-hidden py-0 md:py-0 px-0 md:px-0">
        <div className="absolute top-0 left-0 w-full h-[8px] md:h-[12px] bg-red-600 z-20"></div>
        <div className="w-full h-full md:max-w-[1000px] md:h-[500px] mt-2 md:mt-8 hero-swiper-container relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation={true}
            autoplay={{ delay: 5000 }}
            className="h-full w-full"
          >
            {slides.map(slide => (
              <SwiperSlide key={slide.id}>
                <Link href={`/news/${slide.id}`} className="block h-full w-full">
                  <div className="h-full w-full flex flex-col md:block relative group">
                    <div className="relative w-[350px] h-[216px] md:w-full md:h-full mx-auto md:mx-0 mt-2 md:mt-0 overflow-hidden rounded-[15px] md:rounded-[25px] shadow-md md:shadow-lg">
                      <img src={slide.url} alt={slide.title} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="md:hidden absolute bottom-3 left-3 bg-red-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-20">Trending</div>
                      <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                      <div className="hidden md:flex absolute inset-0 z-20 flex-col justify-end p-12">
                        <div className="mb-4">
                          <span className="bg-red-600 text-white px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase">{slide.category}</span>
                        </div>
                        <h3 className="text-[32px] font-black leading-tight text-white capitalize tracking-normal max-w-2xl">{slide.title}</h3>
                      </div>
                    </div>
                    <div className="md:hidden flex-1 flex flex-col justify-center px-4 py-2">
                      <h3 className="text-[14px] font-black leading-tight text-black capitalize line-clamp-2 tracking-tighter">{slide.title}</h3>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .hero-swiper-container .swiper-button-next,
        .hero-swiper-container .swiper-button-prev {
          color: white !important; width: 60px !important; height: 60px !important; z-index: 50 !important;
        }
        .hero-swiper-container .swiper-button-next::after,
        .hero-swiper-container .swiper-button-prev::after {
          font-size: 40px !important; font-weight: 900 !important; text-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
        .hero-swiper-container .swiper-pagination { display: none !important; }
        @media (max-width: 768px) {
          .hero-swiper-container .swiper-button-next,
          .hero-swiper-container .swiper-button-prev { display: none !important; }
        }
      `}</style>
    </div>
  )
}
