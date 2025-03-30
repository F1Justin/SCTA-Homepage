import '@/styles/globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Noto_Sans_SC } from 'next/font/google'

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-noto-sans-sc',
  preload: true,
})

export const metadata: Metadata = {
  title: '上海高校东方联合会 - 东方Project',
  description: '上海高校东方Project同好会联合会官方网站',
  icons: {
    icon: [
      {
        url: '/icons/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/icons/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      }
    ],
    apple: [
      {
        url: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  },
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '上海高校东方联合会',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://scta.moe',
    title: '上海高校东方联合会 - 东方Project',
    description: '上海高校东方Project同好会联合会官方网站',
    images: [{
      url: '/Logos/上海.png',
      width: 2989,
      height: 4094,
      alt: '上海高校东方联合会',
    }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${notoSansSC.variable} dark:bg-gray-900`}>
      <body className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 font-sans">
        <header className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 sticky top-0 z-50 transition-colors duration-300">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link 
              href="/" 
              className="flex items-center space-x-4 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Image
                src="/Logos/上海.png"
                alt="上海高校东方联合会"
                width={40}
                height={40}
                className="dark:brightness-90 flex-shrink-0"
                priority
              />
              <h1 className="text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">上海高校东方联合会</h1>
            </Link>

            <nav className="hidden md:flex space-x-2">
              <Link 
                href="/" 
                className="text-gray-800 dark:text-gray-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-md"
              >
                首页
              </Link>
              <Link 
                href="/activities" 
                className="text-gray-800 dark:text-gray-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-md"
              >
                活动
              </Link>
              <Link 
                href="/activities-library" 
                className="text-gray-800 dark:text-gray-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-md"
              >
                活动方案库
              </Link>
              <Link 
                href="/#schools" 
                className="text-gray-800 dark:text-gray-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-md"
              >
                成员社团
              </Link>
              <Link 
                href="/#about" 
                className="text-gray-800 dark:text-gray-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-md"
              >
                关于我们
              </Link>
              <Link 
                href="/#contact" 
                className="text-gray-800 dark:text-gray-200 hover:text-brand-red dark:hover:text-brand-red hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 px-3 py-2 rounded-md"
              >
                加入我们
              </Link>
            </nav>
          </div>
        </header>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 transition-colors duration-300">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">上海高校东方联合会</h3>
                <p className="text-gray-300 dark:text-gray-400 mb-4">连接上海各高校东方Project爱好者，共同交流创作与游戏乐趣</p>
                <div className="flex space-x-4">
                  <a href="https://space.bilibili.com/188894280" className="text-white hover:text-brand-gold transition-colors" target="_blank" rel="noopener noreferrer">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                    </svg>
                  </a>
                  <a href="https://github.com/F1Justin/SCTA-Homepage" className="text-white hover:text-brand-gold transition-colors" target="_blank" rel="noopener noreferrer">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">快速链接</h3>
                <ul className="space-y-2">
                  <li><Link href="/#about" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">关于我们</Link></li>
                  <li><Link href="/#activities" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">活动展示</Link></li>
                  <li><Link href="/activities-library" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">活动方案库</Link></li>
                  <li><Link href="/#schools" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">成员社团</Link></li>
                  <li><Link href="/#contact" className="text-gray-300 dark:text-gray-400 hover:text-white transition-colors">加入我们</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 text-white">联系我们</h3>
                <p className="text-gray-300 dark:text-gray-400 mb-2">QQ群：949959173</p>
                <p className="text-gray-300 dark:text-gray-400 mb-2">B站：上海高校东方联合会</p>
              </div>
            </div>
            <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
              <p>© {new Date().getFullYear()} 上海高校东方联合会. 保留所有权利.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
} 