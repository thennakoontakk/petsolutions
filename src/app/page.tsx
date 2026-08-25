import Header from '@/components/layout/Header';
import HeroBanner from '@/components/home/HeroBanner';
import WeeklyDeals from '@/components/home/WeeklyDeals';
import BestSellers from '@/components/home/BestSellers';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <HeroBanner />
        <WeeklyDeals />
        <BestSellers />
        <CategoryShowcase />
        <FeaturedProducts />
      </main>
      <Footer />
    </>
  );
}
