import '@/styles/globals.css'
import type { Locale } from '@/i18n/routing'
import { Noto_Sans_SC } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
  preload: true,
})

export default function SiteDocument({
  locale,
  children,
}: {
  locale: Locale
  children: React.ReactNode
}) {
  return (
    <html lang={locale} className={`${notoSansSC.variable} dark:bg-gray-900`}>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
