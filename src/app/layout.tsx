import type {Metadata} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';

const siteUrl = 'https://rumongetrails.bi';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Rumonge Cultural Trails | Discover the Heart of Burundi',
    template: '%s | Rumonge Cultural Trails',
  },
  description: 'Explore Rumonge Commune in Burundi. Discover Saga Beach, Mugara Hot Springs (Amashuha), Lake Tanganyika, traditional drumming, and local palm oil heritage.',
  keywords: [
    'Rumonge',
    'Burundi Tourism',
    'Lake Tanganyika',
    'Saga Beach',
    'Amashuha',
    'Mugara Hot Springs',
    'Burundian Culture',
    'African Travel',
    'Cultural Heritage',
    'Palm Oil Traditions',
    'Burundi Nature',
    'Rumonge Cultural Trails',
    'Niyibituronsa Hotel',
    'Mawimbi Hotel',
    'SunRise Hotel',
    'Visit Burundi',
    'Eco-tourism Africa',
  ],
  authors: [{ name: 'Rumonge Cultural Trails' }],
  creator: 'Rumonge Cultural Trails Office of the Administrator',
  publisher: 'Rumonge Cultural Trails',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Rumonge Cultural Trails | Discover Burundi',
    description: 'Breathtaking landscapes, rich traditions, and warm hospitality on the shores of Lake Tanganyika.',
    url: siteUrl,
    siteName: 'Rumonge Cultural Trails',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Beautiful sunrise over Lake Tanganyika in Rumonge',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rumonge Cultural Trails | Discover Burundi',
    description: 'The ultimate guide to exploring the natural wonders and cultural heritage of Rumonge.',
    creator: '@RumongeTrails',
    images: ['/og-image.jpg'],
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
  verification: {
    google: 'googled19c5db8dfd51a72',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
