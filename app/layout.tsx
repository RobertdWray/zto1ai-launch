import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Zero to One AI - Launch Your AI Journey',
  description: 'Transform your business with cutting-edge AI solutions. Review your personalized proposal and begin your AI transformation.',
  keywords: 'AI consulting, machine learning, artificial intelligence, business transformation',
  authors: [{ name: 'Zero to One AI' }],
  openGraph: {
    title: 'Zero to One AI - Launch Your AI Journey',
    description: 'Transform your business with cutting-edge AI solutions.',
    url: 'https://launch.zto1ai.com',
    siteName: 'Zero to One AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Zero to One AI',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zero to One AI - Launch Your AI Journey',
    description: 'Transform your business with cutting-edge AI solutions.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-white antialiased">
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          expand
          visibleToasts={5}
        />
      </body>
    </html>
  )
} 