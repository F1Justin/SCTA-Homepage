import '@/styles/globals.css'
import type { Metadata, Viewport } from 'next'
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

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

const SITE_URL = 'https://www.scta.cc';
const SITE_NAME = '上海高校东方联合会';
const SITE_DESCRIPTION = '上海高校东方Project同好会联合会官方网站——连接上海各高校东方Project爱好者，促进同人创作交流';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - 東方Project`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: ['东方Project', '東方Project', 'Touhou', '上海高校', '同人', '弹幕', '幻想乡', 'SCTA'],
  icons: {
    icon: [
      { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: SITE_NAME,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - 東方Project`,
    description: SITE_DESCRIPTION,
    images: [{
      url: '/Logos/上海.png',
      width: 2989,
      height: 4094,
      alt: SITE_NAME,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - 東方Project`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={`${notoSansSC.variable} dark:bg-gray-900`}>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
