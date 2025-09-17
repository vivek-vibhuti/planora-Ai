import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Font with robust fallback and display swap for better CLS
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#16a34a' }, // green-600
    { media: '(prefers-color-scheme: dark)', color: '#0ea5e9' },  // sky-500 accent
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL('https://planora.ai'),
  title: {
    default: 'PLANORA AI | Jharkhand Trip Planner',
    template: '%s | PLANORA AI',
  },
  description:
    'AI-powered trip planning for Jharkhand with real-time search, weather intelligence, and booking assistance. Discover Ranchi, Deoghar, Netarhat, and more.',
  keywords: [
    'Jharkhand tourism',
    'AI trip planner',
    'Ranchi travel',
    'Deoghar temple',
    'Netarhat hill station',
    'PLANORA AI',
    'India travel',
    'trip planning',
  ],
  authors: [{ name: 'PLANORA AI Team' }],
  openGraph: {
    title: 'PLANORA AI | Jharkhand Trip Planner',
    description:
      'Discover Jharkhand with AI-powered trip planning. Get personalized itineraries, weather intelligence, and local insights.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'PLANORA AI',
    url: 'https://planora.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PLANORA AI | Jharkhand Trip Planner',
    description: 'AI-powered trip planning for Jharkhand with Gemini AI',
    creator: '@planoraai',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  alternates: { canonical: 'https://planora.ai' },
  applicationName: 'PLANORA AI',
  category: 'travel',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Container slots for sticky header/footer and main app shell
  return (
    <html
      lang="en"
      className="min-h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {/* Preconnects to improve font loading and reduce CLS */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body
        className={[
          inter.variable,
          'min-h-screen bg-gradient-to-br from-white to-gray-50',
          'text-gray-900',
          'selection:bg-green-200 selection:text-green-900',
          'supports-[gap]:flex supports-[gap]:flex-col',
          'pt-safe pb-safe', // iOS notch safe-area
        ].join(' ')}
      >
        {/* App shell */}
        <div id="app-shell" className="flex min-h-screen flex-col">
          {/* Optional: <Header /> mounted in layout.tsx in app router, or in pages/_app.tsx */}
          <main id="main-content" className="flex-1">
            {children}
          </main>
          {/* Optional: <Footer /> */}
        </div>

        {/* Portals for modals/toasts */}
        <div id="portal-toasts" />
        <div id="portal-modals" />
      </body>
    </html>
  );
}
