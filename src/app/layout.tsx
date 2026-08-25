import type { Metadata, Viewport } from 'next';
import { Outfit, Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { CartProvider } from '@/lib/hooks/useCart';
import FloatingActions from '@/components/layout/FloatingActions';
import './globals.css';

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
   Metadata
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
  ],
  authors: [{ name: 'PetSolutions.lk' }],
  creator: 'PetSolutions.lk',
  metadataBase: new URL('https://petsolutions.lk'),
  openGraph: {
    type: 'website',
    locale: 'en_LK',
    siteName: 'PetSolutions.lk',
    title: 'PetSolutions.lk — Premium Pet Care Products',
    description:
      'Sri Lanka\'s trusted online pet store. Shop premium food, treats, toys, and accessories for cats & dogs.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetSolutions.lk — Premium Pet Care Products',
    description:
      'Sri Lanka\'s trusted online pet store for cats & dogs.',
  },
  robots: {
    index: true,
    follow: true,
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
      <body className="min-h-screen bg-dominant font-body text-text antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <FloatingActions />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
