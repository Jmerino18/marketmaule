import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/sections/HeroSection";
import SearchSection from "@/sections/SearchSection";
import FeaturedEntrepreneurs from "@/sections/FeaturedEntrepreneurs";
import RecentEntrepreneurs from "@/sections/RecentEntrepreneurs";
import JoinSection from "@/sections/JoinSection";
import NewsSection from "@/sections/NewsSection";
import InstagramSection from "@/sections/InstagramSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <SearchSection />
        <FeaturedEntrepreneurs />
        <JoinSection />
        <RecentEntrepreneurs />
        <NewsSection />
        <InstagramSection />
      </main>
      <Footer />
    </div>
  );
}
