'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Dog Food & Treats',
    slug: 'dry-wet-pet-food',
    petType: 'Dog',
    image: '/images/storefront/cat-dog-food.jpg',
  },
  {
    name: 'Cat Food & Treats',
    slug: 'dry-wet-pet-food',
    petType: 'Cat',
    image: '/images/storefront/cat-cat-food.jpg',
  },
  {
    name: 'Health & Wellness',
    slug: 'health-supplements',
    image: '/images/storefront/cat-health.jpg',
  },
  {
    name: 'Grooming & Hygiene',
    slug: 'medicated-shampoos-grooming',
    image: '/images/storefront/cat-grooming.jpg',
  },
  {
    name: 'Tick & Flea Control',
    slug: 'parasite-tick-control',
    image: '/images/storefront/deals-dog.jpg',
  },
  {
    name: 'Cat Litter & Hygiene',
    slug: 'cat-litter-hygiene',
    image: '/images/storefront/brand-story-cat.jpg',
  },
];

// 4 duplicate sets to guarantee smooth, seamless infinite circular looping on mobile
const marqueeCategories = [...categories, ...categories, ...categories, ...categories];

export default function CategoryShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const xPosRef = useRef(0);
  const singleSetWidthRef = useRef(0);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartPosRef = useRef(0);
  const hasDraggedRef = useRef(false);
  const reqIdRef = useRef<number | null>(null);

  // Speed: ~0.75px per frame for a smooth, gentle continuous glide
  const SPEED = 0.75;

  // Calculate the exact width of a single set of 6 cards
  useEffect(() => {
    const updateWidth = () => {
      if (!trackRef.current) return;
      const firstChild = trackRef.current.children[0] as HTMLElement;
      if (!firstChild) return;
      const cardWidth = firstChild.offsetWidth;
      const gap = 14;
      singleSetWidthRef.current = categories.length * (cardWidth + gap);
    };

    updateWidth();
    // Re-check on window resize
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Continuous animation loop for mobile marquee
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 16.666, 2.5);
      lastTime = currentTime;

      // Only run auto-gliding when not dragging, not hovered, and on mobile (< 768px)
      if (
        !isDraggingRef.current &&
        !isHoveredRef.current &&
        window.innerWidth < 768 &&
        singleSetWidthRef.current > 0
      ) {
        xPosRef.current -= SPEED * delta;

        // Infinite seamless loop wrap without any jumping
        if (xPosRef.current <= -singleSetWidthRef.current) {
          xPosRef.current += singleSetWidthRef.current;
        } else if (xPosRef.current > 0) {
          xPosRef.current -= singleSetWidthRef.current;
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${xPosRef.current}px, 0, 0)`;
        }
      }

      reqIdRef.current = requestAnimationFrame(animate);
    };

    reqIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
    };
  }, []);

  // Touch / mouse drag handlers for finger swiping
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    dragStartXRef.current = clientX;
    dragStartPosRef.current = xPosRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const diff = clientX - dragStartXRef.current;

    if (Math.abs(diff) > 5) {
      hasDraggedRef.current = true;
    }

    let newPos = dragStartPosRef.current + diff;
    const setWidth = singleSetWidthRef.current;

    // Handle seamless wrapping while dragging
    if (setWidth > 0) {
      while (newPos <= -setWidth) {
        newPos += setWidth;
        dragStartPosRef.current += setWidth;
      }
      while (newPos > 0) {
        newPos -= setWidth;
        dragStartPosRef.current -= setWidth;
      }
    }

    xPosRef.current = newPos;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${newPos}px, 0, 0)`;
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // If the user was dragging/swiping, cancel link navigation so it doesn't misfire
    if (hasDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section className="py-12 sm:py-16 container mx-auto px-4 overflow-hidden">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-6 sm:mb-10">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1C1917] tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-[#78716C] mt-1">
            Find the perfect products for every stage of your pet&apos;s life.
          </p>
        </div>
        <Link
          href="/products?filter=open"
          className="text-xs sm:text-sm font-bold text-[#F97316] hover:text-[#EA580C] flex items-center gap-1.5 transition-colors group"
        >
          <span>View All Categories</span>
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ── DESKTOP VIEW: Clean 6-Column Static Grid (≥ 768px) ── */}
      <div className="hidden md:grid md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={`desktop-${category.name}`}
            href={
              category.petType
                ? `/products?category=${category.slug}&pet_type=${category.petType}`
                : `/products?category=${category.slug}`
            }
            className="group block h-full select-none"
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-[#BDDFEA]/60 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-end text-center bg-[#F5F2EB]"
              style={{
                height: '220px',
                minHeight: '220px',
                padding: '14px 12px 20px 12px',
              }}
            >
              <img
                src={category.image}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 20%',
                }}
                className="absolute inset-0 group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.25) 55%, rgba(0, 0, 0, 0.75) 85%, rgba(0, 0, 0, 0.92) 100%)',
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-end text-center w-full">
                <h3 className="font-heading font-extrabold text-xs sm:text-sm text-white group-hover:text-[#FFC800] transition-colors leading-snug line-clamp-2 min-h-[2rem] flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                  {category.name}
                </h3>
                <div
                  className="mx-auto mt-2.5 shadow-md transition-all duration-300 group-hover:scale-110 shrink-0"
                  style={{
                    width: '28px',
                    height: '28px',
                    backgroundColor: '#FFC800',
                    color: '#1A1A2E',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(255, 200, 0, 0.4)',
                  }}
                >
                  <ArrowRight size={13} className="text-[#1A1A2E] stroke-[2.5]" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── MOBILE VIEW: Smooth Continuous Circular Marquee (< 768px) with Touch Drag ── */}
      <div 
        ref={containerRef}
        className="block md:hidden w-full overflow-hidden relative py-2 select-none -mx-4 px-4"
        style={{ width: 'calc(100% + 2rem)' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => {
          handleTouchEnd();
          isHoveredRef.current = false;
        }}
        onMouseEnter={() => { isHoveredRef.current = true; }}
      >
        {/* Soft edge fade overlays to hide raw crop cuts like the hero feature marquee */}
        <div 
          className="absolute top-0 bottom-0 left-0 w-12 z-20 pointer-events-none" 
          style={{ background: 'linear-gradient(90deg, #FEF9EC 0%, rgba(254,249,236,0) 100%)' }} 
        />
        <div 
          className="absolute top-0 bottom-0 right-0 w-12 z-20 pointer-events-none" 
          style={{ background: 'linear-gradient(270deg, #FEF9EC 0%, rgba(254,249,236,0) 100%)' }} 
        />

        {/* Continuous hardware-accelerated animated track */}
        <div
          ref={trackRef}
          className="flex will-change-transform cursor-grab active:cursor-grabbing"
          style={{
            width: 'max-content',
            gap: '14px',
            touchAction: 'pan-y',
          }}
        >
          {marqueeCategories.map((category, idx) => (
            <Link
              key={`mobile-${category.name}-${idx}`}
              href={
                category.petType
                  ? `/products?category=${category.slug}&pet_type=${category.petType}`
                  : `/products?category=${category.slug}`
              }
              onClick={handleCardClick}
              className="group block select-none shrink-0"
              style={{ width: '150px' }}
            >
              <div
                className="relative overflow-hidden rounded-2xl border border-[#BDDFEA]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-end text-center bg-[#F5F2EB]"
                style={{
                  height: '210px',
                  minHeight: '210px',
                  padding: '14px 10px 18px 10px',
                }}
              >
                {/* Full Card Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                  }}
                  className="absolute inset-0 group-hover:scale-108 transition-transform duration-500 pointer-events-none select-none"
                  loading="lazy"
                />

                {/* Gradient Overlay for Text Contrast */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(180deg, rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0.25) 55%, rgba(0, 0, 0, 0.75) 85%, rgba(0, 0, 0, 0.92) 100%)',
                  }}
                />

                {/* Overlaid Bottom Content */}
                <div className="relative z-10 flex flex-col items-center justify-end text-center w-full pointer-events-none">
                  <h3 className="font-heading font-extrabold text-xs text-white group-hover:text-[#FFC800] transition-colors leading-snug line-clamp-2 min-h-[2rem] flex items-center justify-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
                    {category.name}
                  </h3>

                  <div
                    className="mx-auto mt-2 shadow-md transition-all duration-300 group-hover:scale-110 shrink-0"
                    style={{
                      width: '26px',
                      height: '26px',
                      backgroundColor: '#FFC800',
                      color: '#1A1A2E',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(255, 200, 0, 0.4)',
                    }}
                  >
                    <ArrowRight size={12} className="text-[#1A1A2E] stroke-[2.5]" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
