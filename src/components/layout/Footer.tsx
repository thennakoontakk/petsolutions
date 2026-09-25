'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@/lib/supabase/client';

/* --------------------------------------------------------------------------
   Payment Vector Badges (Clean, Authentic White Cards)
   -------------------------------------------------------------------------- */
function VisaBadge() {
  return (
    <div className="pet-footer-payment-card" title="Visa">
      <svg
        style={{ width: '42px', height: '14px', display: 'block' }}
        viewBox="0 0 50 16"
        fill="none"
      >
        <path
          d="M19.3 0.6L12.7 15.4H8.4L5.1 3.3C4.9 2.5 4.7 2.2 4.0 1.8C2.9 1.2 1.4 0.7 0 0.4L0.1 0H7.3C8.2 0 9.0 0.6 9.2 1.6L10.9 10.9L15.1 0.6H19.3ZM36.1 10.5C36.1 6.5 30.5 6.3 30.5 4.5C30.5 3.9 31.1 3.3 32.3 3.1C32.9 3.0 34.5 2.9 36.2 3.7L36.9 0.6C35.9 0.2 34.6 0 33.0 0C28.9 0 26.1 2.2 26.1 5.3C26.1 7.6 28.1 8.9 29.7 9.7C31.3 10.5 31.8 11.0 31.8 11.7C31.8 12.8 30.5 13.3 29.3 13.3C27.2 13.3 26.0 13.0 25.0 12.5L24.3 15.7C25.4 16.2 27.2 16.6 29.1 16.6C33.4 16.6 36.1 14.5 36.1 10.5ZM46.9 15.4H50.8L47.4 0.4H43.8C42.9 0.4 42.2 0.9 41.8 1.7L35.7 15.4H40.1L41.0 12.9H46.3L46.9 15.4ZM42.2 9.8L44.4 3.7L45.6 9.8H42.2ZM24.9 0.4L21.4 15.4H17.2L20.7 0.4H24.9Z"
          fill="#1434CB"
        />
        <path d="M5.1 3.3L8.4 15.4H4.0L0.6 2.4C1.9 2.7 3.7 3.0 5.1 3.3Z" fill="#FAA61A" />
      </svg>
    </div>
  );
}

function MastercardBadge() {
  return (
    <div className="pet-footer-payment-card" title="Mastercard">
      <svg
        style={{ width: '36px', height: '22px', display: 'block' }}
        viewBox="0 0 38 24"
        fill="none"
      >
        <circle cx="12" cy="12" r="12" fill="#EB001B" />
        <circle cx="26" cy="12" r="12" fill="#F79E1B" />
        <path
          d="M19 4.3a11.96 11.96 0 0 0-4.6 7.7 11.96 11.96 0 0 0 4.6 7.7 11.96 11.96 0 0 0 4.6-7.7A11.96 11.96 0 0 0 19 4.3Z"
          fill="#FF5F00"
        />
      </svg>
    </div>
  );
}

function AmexBadge() {
  return (
    <div className="pet-footer-payment-card" title="American Express">
      <div
        style={{
          backgroundColor: '#006FCF',
          color: '#FFFFFF',
          borderRadius: '3px',
          width: '54px',
          height: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          boxSizing: 'border-box',
          lineHeight: '1.1',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: '6px', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          AMERICAN
        </span>
        <span style={{ fontSize: '6px', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          EXPRESS
        </span>
      </div>
    </div>
  );
}

function PaypalBadge() {
  return (
    <div className="pet-footer-payment-card" title="PayPal">
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <svg
          style={{ width: '13px', height: '15px', display: 'block', flexShrink: 0 }}
          viewBox="0 0 24 28"
          fill="none"
        >
          <path
            d="M6.3 24.5L9.6 3.6C9.8 2.2 10.9 1.1 12.4 1.1H18.7C21.8 1.1 23.5 2.6 23.1 5.3C22.6 8.5 20.3 10.4 17.5 10.4H13.6L12.0 20.5C11.9 21.3 11.2 21.9 10.4 21.9H6.9C6.4 21.9 6.2 22.3 6.3 22.8L6.3 24.5Z"
            fill="#003087"
          />
          <path
            d="M8.8 26.2L11.5 9.1C11.7 7.7 12.8 6.6 14.3 6.6H20.6C23.7 6.6 25.4 8.1 25.0 10.8C24.5 14.0 22.2 15.9 19.4 15.9H15.5L13.9 26.0C13.8 26.8 13.1 27.4 12.3 27.4H9.4C8.9 27.4 8.7 26.7 8.8 26.2Z"
            fill="#0079C1"
          />
        </svg>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            fontStyle: 'italic',
            letterSpacing: '-0.02em',
            color: '#003087',
            lineHeight: 1,
          }}
        >
          Pay<span style={{ color: '#0079C1' }}>Pal</span>
        </span>
      </div>
    </div>
  );
}

function ApplePayBadge() {
  return (
    <div className="pet-footer-payment-card" title="Apple Pay">
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <svg
          style={{ width: '13px', height: '16px', fill: '#000000', display: 'block', flexShrink: 0 }}
          viewBox="0 0 170 170"
        >
          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.07-7.66-7.83-11.87-14.28-6.1-9.33-10.74-20.03-13.9-32.08-3.17-12.06-4.76-23.36-4.76-33.88 0-14.85 3.73-26.68 11.2-35.48 7.46-8.81 16.7-13.29 27.71-13.46 5.11 0 10.59 1.34 16.44 4.02 5.85 2.68 9.68 4.07 11.48 4.17 1.43 0 5.49-1.51 12.18-4.53 6.69-3.02 12.39-4.37 17.1-4.04 12.9.84 23.12 5.86 30.65 15.06-11.4 6.89-16.94 16.5-16.63 28.84.28 9.8 4.05 17.9 11.31 24.31 4.7 4.2 10.02 7.02 15.96 8.48-2.61 7.6-5.78 15.34-9.52 23.23zM119.22 33.45c0-7.39 2.64-14.16 7.93-20.31 5.29-6.15 11.95-9.88 19.98-11.2.14 1.13.21 2.12.21 2.97 0 7.39-2.79 14.36-8.37 20.91-5.58 6.55-12.32 10.15-20.21 10.8-.28-1.06-.42-2.12-.42-3.17z" />
        </svg>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#000000',
            lineHeight: 1,
          }}
        >
          Pay
        </span>
      </div>
    </div>
  );
}

function GooglePayBadge() {
  return (
    <div className="pet-footer-payment-card" title="Google Pay">
      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
        <svg
          style={{ width: '15px', height: '15px', display: 'block', flexShrink: 0 }}
          viewBox="0 0 24 24"
        >
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: '#3C4043',
            lineHeight: 1,
          }}
        >
          Pay
        </span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
   Footer Component
   -------------------------------------------------------------------------- */
export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [hotline, setHotline] = useState('+94 77 123 4567');

  // Fetch hotline dynamically from store_settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const supabase = createBrowserClient();
        const { data } = await supabase
          .from('store_settings')
          .select('value, is_enabled')
          .eq('key', 'hotline')
          .single();

        if (data && data.is_enabled && data.value) {
          setHotline(data.value);
        }
      } catch {
        // Fallback to default
      }
    }
    fetchSettings();
  }, []);

  return (
    <footer className="pet-footer">
      <div className="pet-footer-container">
        
        {/* Main 5-Section Layout */}
        <div className="pet-footer-main">
          
          {/* Column 1: Brand & Socials */}
          <div className="pet-footer-brand">
            <Link href="/" className="pet-footer-logo-link">
              <Image
                src="/logo-icon.png"
                width={44}
                height={44}
                alt="PetSolutions.lk Logo"
                className="pet-footer-logo-icon"
                priority
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Image
                  src="/logo-text.png"
                  width={155}
                  height={38}
                  alt="PetSolutions.lk"
                  className="pet-footer-logo-wordmark"
                  priority
                />
                <span className="pet-footer-tagline">Happy Pets, Happy Life</span>
              </div>
            </Link>

            <p className="pet-footer-description">
              Everything your pet needs,
              <br />
              all in one place.
            </p>

            {/* Social Media Icons */}
            <div className="pet-footer-socials">
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSolutions Facebook"
                className="pet-footer-social-link"
              >
                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSolutions Instagram"
                className="pet-footer-social-link"
              >
                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSolutions Pinterest"
                className="pet-footer-social-link"
              >
                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.366-.053.225-.177.271-.407.165-1.52-.707-2.469-2.927-2.469-4.71 0-3.839 2.788-7.365 8.044-7.365 4.225 0 7.508 3.011 7.508 7.035 0 4.199-2.646 7.579-6.322 7.579-1.234 0-2.397-.641-2.793-1.401l-.76 2.898c-.276 1.059-1.023 2.387-1.523 3.2 1.137.351 2.348.544 3.606.544 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSolutions YouTube"
                className="pet-footer-social-link"
              >
                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${hotline.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PetSolutions WhatsApp Hotline"
                className="pet-footer-social-link"
                title={`WhatsApp: ${hotline}`}
              >
                <svg style={{ width: '18px', height: '18px', fill: 'currentColor' }} viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: SHOP */}
          <div>
            <h3 className="pet-footer-heading">SHOP</h3>
            <ul className="pet-footer-list">
              <li>
                <Link href="/products">All Products</Link>
              </li>
              <li>
                <Link href="/products?category=dog-food-dry">Dogs</Link>
              </li>
              <li>
                <Link href="/products?category=cat-food-dry">Cats</Link>
              </li>
              <li>
                <Link href="/products?category=birds">Birds</Link>
              </li>
              <li>
                <Link href="/products?category=small-pets">Small Pets</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: CUSTOMER SERVICE */}
          <div>
            <h3 className="pet-footer-heading">CUSTOMER SERVICE</h3>
            <ul className="pet-footer-list">
              <li>
                <Link href="/auth/login">My Account</Link>
              </li>
              <li>
                <Link href="/orders">Order Tracking</Link>
              </li>
              <li>
                <Link href="/products">Returns &amp; Refunds</Link>
              </li>
              <li>
                <Link href="/products">Shipping Info</Link>
              </li>
              <li>
                <Link href="/products">FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: INFORMATION */}
          <div>
            <h3 className="pet-footer-heading">INFORMATION</h3>
            <ul className="pet-footer-list">
              <li>
                <Link href="/products">About Us</Link>
              </li>
              <li>
                <Link href="/products">Blog</Link>
              </li>
              <li>
                <Link href="/products">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/products">Terms &amp; Conditions</Link>
              </li>
              <li>
                <Link href="/products">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Vertical Divider (Desktop) */}
          <div className="pet-footer-divider" />

          {/* Column 5: WE ACCEPT */}
          <div className="pet-footer-payments">
            <h3 className="pet-footer-heading">WE ACCEPT</h3>
            
            {/* 3 x 2 Grid of Payment Badges */}
            <div className="pet-footer-payment-grid">
              <VisaBadge />
              <MastercardBadge />
              <AmexBadge />
              <PaypalBadge />
              <ApplePayBadge />
              <GooglePayBadge />
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Hotline Reference */}
        <div className="pet-footer-bottom">
          <div>
            <span>&copy; {currentYear} PetSolutions.lk. All rights reserved.</span>
            <span style={{ margin: '0 8px', color: '#CBD4CD' }}>·</span>
            <span style={{ fontSize: '11px', color: '#849188' }}>
              Sri Lanka&apos;s Trusted Pet Care &amp; Nutrition Hub
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 500, color: '#4F5952' }}>
            <span>Hotline: <a href={`tel:${hotline}`} style={{ color: '#28593E', fontWeight: 700 }}>{hotline}</a></span>
            <span style={{ color: '#CBD4CD' }}>·</span>
            <span>Daily 8:30 AM – 8:30 PM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
