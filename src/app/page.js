import Navbar from "./components/Navbar"
import HeroSlider from "./components/HeroSlider"
import NewsCardList from "./components/NewsCardList"
import Footer from "./components/Footer"
import MiniScrollList from "./components/MiniScrollList"

export default function Home() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col overflow-x-hidden p-0 m-0 pb-0 md:pb-0">
      <Navbar />
      <div className="flex flex-col bg-white pb-10 md:pb-20">
        <HeroSlider />
        <MiniScrollList isTrending={true} />
        <NewsCardList limit={8} />
      </div>

      <Footer />
    </main>
  )
}
