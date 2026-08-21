'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-12 pb-6 border-t border-white/10" style={{ backgroundColor: '#111122', color: '#FFFFFF' }}>
      <div className="container mx-auto px-4 grid grid-1 md:grid-4 gap-8">
        
        {/* About Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image src="/logo-icon.png" width={60} height={60} alt="PetSolutions Icon" style={{ objectFit: 'contain', height: '60px', width: 'auto' }} />
            <Image src="/logo-text.png" width={110} height={30} alt="PetSolutions.lk" style={{ objectFit: 'contain', height: '30px', width: 'auto', filter: 'brightness(0) invert(1)' }} />
          </div>
          <p className="text-xs" style={{ lineHeight: 1.8, color: 'rgba(255, 255, 255, 0.7)' }}>
            Premium e-commerce platform for pet care in Sri Lanka. Providing top-quality pet foods, grooming items, tick treatments, and health supplements for your beloved dogs and cats.
          </p>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 bg-white/10 hover:bg-accent rounded-full transition-colors flex items-center justify-center" style={{ color: '#FFFFFF' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="#" className="p-2 bg-white/10 hover:bg-accent rounded-full transition-colors flex items-center justify-center" style={{ color: '#FFFFFF' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
            <a href="#" className="p-2 bg-white/10 hover:bg-accent rounded-full transition-colors flex items-center justify-center" style={{ color: '#FFFFFF' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-accent uppercase tracking-wider">Quick Links</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Home</Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>All Products</Link>
            </li>
            <li>
              <Link href="/orders" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Shopping History</Link>
            </li>
            <li>
              <Link href="/auth/login" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Customer Login</Link>
            </li>
          </ul>
        </div>

        {/* Categories Column */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-accent uppercase tracking-wider">Top Categories</h3>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/products?category=dog-food-dry" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Dog Food - Dry</Link>
            </li>
            <li>
              <Link href="/products?category=cat-food-dry" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cat Food - Dry</Link>
            </li>
            <li>
              <Link href="/products?category=tick-flea-treatment" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Tick & Flea Treatment</Link>
            </li>
            <li>
              <Link href="/products?category=shampoo-grooming" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Shampoo & Grooming</Link>
            </li>
            <li>
              <Link href="/products?category=cat-litter" className="hover:text-accent transition-colors" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Cat Litter</Link>
            </li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm text-accent uppercase tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-xs" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            <li className="flex items-start gap-2">
              <MapPin size={16} className="text-accent flex-shrink-0 mt-0.5" />
              <span>Colombo, Sri Lanka</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-accent flex-shrink-0" />
              <span>+94 77 123 4567</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-accent flex-shrink-0" />
              <span>support@petsolutions.lk</span>
            </li>
          </ul>
        </div>

      </div>

      <hr className="border-white/10 my-8 container mx-auto px-4" />

      {/* Footer Bottom */}
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
        <p>&copy; {currentYear} PetSolutions.lk. All rights reserved.</p>
        
        {/* Payment Methods */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>We Accept:</span>
          <div className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-[10px]">
            Cash on Delivery
          </div>
          <div className="px-2 py-1 bg-white/5 rounded border border-white/10 font-bold text-[10px]">
            Bank Transfer
          </div>
        </div>
      </div>
    </footer>
  );
}
