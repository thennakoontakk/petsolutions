import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { CartProvider } from '@/lib/hooks/useCart';
import FloatingActions from '@/components/layout/FloatingActions';
import ClickPawPulse from '@/components/layout/ClickPawPulse';
import { Toaster } from 'sonner';
import './globals.css';
import './weekly-deals.css';

/* --------------------------------------------------------------------------
   Google Fonts — loaded via next/font for zero layout-shift
   -------------------------------------------------------------------------- */
const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
});

/* --------------------------------------------------------------------------
   Metadata & SEO
   -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  title: {
    default: 'PetSolutions.lk — Premium Pet Care Products',
    template: '%s | PetSolutions.lk',
  },
  description:
    'Sri Lanka\'s trusted online pet store. Shop premium food, treats, toys, and accessories for cats & dogs. Fast island-wide delivery.',
  keywords: [
    'pet store',
    'Sri Lanka',
    'cat food',
    'dog food',
    'pet accessories',
    'pet care',
    'PetSolutions',
    'online pet shop',
    'dewormers',
    'veterinary medicines',
  ],
  authors: [{ name: 'PetSolutions.lk' }],
  creator: 'PetSolutions.lk',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://petsolutions.lk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    siteName: 'PetSolutions.lk',
    title: 'PetSolutions.lk — Premium Pet Care Products',
    description:
      'Sri Lanka\'s trusted online pet store. Shop premium food, treats, toys, and accessories for cats & dogs.',
    url: 'https://petsolutions.lk',
    images: [
      {
        url: '/logo-icon.png',
        width: 512,
        height: 512,
        alt: 'PetSolutions.lk Sri Lanka',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetSolutions.lk — Premium Pet Care Products',
    description:
      'Sri Lanka\'s trusted online pet store for cats & dogs.',
    images: ['/logo-icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo-icon.png' },
      { url: '/logo-icon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-icon.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/logo-icon.png',
    apple: [
      { url: '/logo-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'PetStore',
  name: 'PetSolutions.lk',
  legalName: 'Guardian Agriculture (Pvt) Ltd',
  url: 'https://petsolutions.lk',
  logo: 'https://petsolutions.lk/logo-icon.png',
  image: 'https://petsolutions.lk/logo-icon.png',
  description: "Sri Lanka's trusted online pet store for cats & dogs food, accessories, and veterinary products.",
  telephone: '+94777804175',
  email: 'info@petsolutions.lk',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Lot No. 01, Lanka Industrial Estates (LINDEL), Maguruvila Road, Gonawala',
    addressLocality: 'Kelaniya',
    addressRegion: 'Western Province',
    addressCountry: 'LK',
  },
  priceRange: 'LKR',
  currenciesAccepted: 'LKR',
  paymentAccepted: 'Credit Card, Debit Card, Cash on Delivery, OnePay',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'PetSolutions.lk',
  url: 'https://petsolutions.lk',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://petsolutions.lk/products?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FEFCF3',
};

/* --------------------------------------------------------------------------
   Root Layout
   -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="min-h-screen bg-dominant font-body text-text antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingActions />
            <ClickPawPulse />
            <Toaster position="top-right" richColors closeButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
