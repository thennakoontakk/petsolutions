import Header from '@/components/layout/Header';
import HeroBanner from '@/components/home/HeroBanner';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#FEFCF3]">
        {/* 1. Original Preferred Hero Banner with Video & Marquee */}
        <HeroBanner />

        {/* 2. Shop by Category (6 Rounded Pastel Cards) */}
        <CategoryShowcase />

        {/* Featured Products 5-Column Grid */}
        <FeaturedProducts />

        {/* 7. Brand Story & Mission */}
        <BrandStory />

        {/* 8. Customer Testimonials & Reviews */}
        <Testimonials />

        {/* 9. Newsletter Subscription Banner */}
        <NewsletterBanner />
      </main>

      {/* 10. Original Preferred Comprehensive Footer */}
      <Footer />
    </>
  );
}
