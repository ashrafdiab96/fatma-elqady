import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Lalezar } from 'next/font/google'
import './globals.css'
import { SiteShell } from '@/components/site-shell'
import { asset } from '@/lib/site'

const display = Bricolage_Grotesque({ subsets: ['latin'], axes: ['opsz', 'wdth'], variable: '--font-display', display: 'swap' })
const arabic = Lalezar({ subsets: ['arabic'], weight: '400', variable: '--font-arabic', display: 'swap' })

export const metadata: Metadata = {
  title: 'Fatma Elqady — Senior Graphic Designer & Illustrator',
  description: 'Portfolio of Fatma Elqady, a Cairo-based senior graphic designer and illustrator: social campaigns, advertising, mascot design, picture books and illustration.',
  openGraph: {
    title: 'Fatma Elqady — Senior Graphic Designer & Illustrator',
    description: 'Social campaigns, advertising, mascot design, picture books and illustration by Fatma Elqady.',
  },
  icons: {
    icon: [
      {
        url: asset('/icon-light-32x32.png'),
        media: '(prefers-color-scheme: light)',
      },
      {
        url: asset('/icon-dark-32x32.png'),
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: asset('/icon.svg'),
        type: 'image/svg+xml',
      },
    ],
    apple: asset('/apple-icon.png'),
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
    <html lang="en" className={`${display.variable} ${arabic.variable}`}>
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
