import '@/styles/globals.css'
import '@/styles/mobile.css'
import type { Locale } from '@/i18n/routing'
import { Noto_Sans_SC } from 'next/font/google'
import localFont from 'next/font/local'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  variable: '--font-noto-sans-sc',
  preload: false,
})

const siteFont = localFont({
  src: '../../styles/type/SctaText.woff2',
  variable: '--font-scta-text',
  weight: '100 900',
  display: 'swap',
  adjustFontFallback: false,
})

export default function SiteDocument({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <html lang={locale} className={`${siteFont.variable} ${notoSansSC.variable} dark:bg-gray-900`}>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
        {children}
        {process.env.VERCEL === '1' && <><Analytics /><SpeedInsights /></>}
      </body>
    </html>
  )
}
