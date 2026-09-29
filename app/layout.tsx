import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Instrument_Serif, Lalezar } from 'next/font/google'
import './globals.css'
import { SiteShell } from '@/components/site-shell'

const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz', 'wdth'], variable: '--font-display', display: 'swap' })
const serif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' })
const arabic = Lalezar({ subsets: ['arabic'], weight: '400', variable: '--font-arabic', display: 'swap' })

export const metadata: Metadata = {
  title: 'Fatma Elqady — Graphic Designer & Illustrator',
  description: 'Portfolio of Fatma Elqady, a Cairo-based graphic designer, illustrator and motion designer.',
  generator: 'v0.app',
  openGraph: {
    title: 'Fatma Elqady — Graphic Designer & Illustrator',
    description: 'Picture books, character design, visual development, campaigns and motion by Fatma Elqady.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0b0b',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${arabic.variable}`}>
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
