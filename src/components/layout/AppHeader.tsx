'use client';

import { useState, useEffect, useRef } from 'react';
import { getPathname, Link, usePathname } from '@/i18n/navigation';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { routing, type Locale } from '@/i18n/routing';

const localeLabels: Record<Locale, { short: string; name: string }> = {
  zh: { short: '中', name: '中文' },
  en: { short: 'EN', name: 'English' },
  ja: { short: '日', name: '日本語' },
};

export default function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menu = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations('nav');
  const ft = useTranslations('footer');
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const dialog = menu.current;
    if (!isMobileMenuOpen || !dialog) return;

    dialog.showModal();
    const media = window.matchMedia(locale === 'en' ? '(min-width: 1024px)' : '(min-width: 768px)');
    const onDesktop = () => { if (media.matches) dialog.close(); };
    media.addEventListener('change', onDesktop);
    return () => media.removeEventListener('change', onDesktop);
  }, [isMobileMenuOpen, locale]);

  const closeMenu = () => menu.current?.close();

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'));

  const switchLocale = (nextLocale: Locale) => {
    if (locale === nextLocale) return;

    const { search, hash } = window.location;
    const href = getPathname({ href: pathname, locale: nextLocale });
    router.push(href + search + hash, { scroll: Boolean(hash) });
  };

  const navItems = [
    { href: '/', label: t('home'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { href: '/activities', label: t('activities'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { href: '/activities-library', label: t('library'), icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { href: '/', hash: 'schools', label: t('schools'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { href: '/', hash: 'about', label: t('about'), icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { href: '/', hash: 'contact', label: t('contact'), icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ].map(item => ({
    ...item,
    active: !item.hash && isActive(item.href),
    link: item.hash ? { pathname: item.href, hash: item.hash } : item.href,
  }));

  return (
    <header className={`site-header bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-700/10 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-3'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" aria-label={ft('orgName')} className="site-brand flex items-center space-x-3 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
          <Image src="/Logos/上海.png" alt="SCTA" width={40} height={40} className="dark:brightness-90 flex-shrink-0" priority />
          <span className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">{ft('orgName')}</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop nav */}
          <nav aria-label={t('navigation')} className="site-nav-desktop hidden md:flex space-x-1">
            {navItems.map((item) => (
              <Link key={item.hash ?? item.href} href={item.link} aria-current={item.active ? 'page' : undefined} className={`nav-link ${item.active ? 'bg-gray-100 dark:bg-gray-700 text-brand-red dark:text-red-400 font-medium' : ''}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Language switcher */}
          <div className="site-language flex items-center border border-gray-200 dark:border-gray-600 rounded-full overflow-hidden" role="group" aria-label={t('language')}>
            {routing.locales.map((loc) => (
              <button
                key={loc}
                type="button"
                lang={loc}
                aria-label={localeLabels[loc].name}
                aria-pressed={locale === loc}
                onClick={() => switchLocale(loc)}
                className={`px-2.5 py-1 text-xs font-medium transition-colors ${
                  locale === loc
                    ? 'bg-brand-red text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {localeLabels[loc].short}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            ref={menuTrigger}
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="site-menu-toggle md:hidden p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-red"
            aria-label={t('toggleMenu')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      <dialog
        id="mobile-menu"
        ref={menu}
        aria-labelledby="mobile-menu-title"
        className="site-menu-drawer bg-white dark:bg-gray-800 shadow-xl rounded-r-2xl"
        onClick={event => {
          if (event.target === event.currentTarget && event.clientX > event.currentTarget.getBoundingClientRect().right) closeMenu();
        }}
        onClose={() => {
          setIsMobileMenuOpen(false);
          menuTrigger.current?.focus({ preventScroll: true });
        }}
      >
        {isMobileMenuOpen && <>
              <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Image src="/Logos/上海.png" alt="SCTA" width={36} height={36} className="dark:brightness-90" />
                  <h2 id="mobile-menu-title" className="text-xl font-bold text-gray-900 dark:text-white">{t('navigation')}</h2>
                </div>
                <button type="button" autoFocus onClick={closeMenu} className="site-menu-close p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={t('closeMenu')}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-6">
                <div className="space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.hash ?? item.href}
                      href={item.link}
                      aria-current={item.active ? 'page' : undefined}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                        item.active ? 'bg-brand-red/10 text-brand-red dark:text-red-400 font-medium' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={closeMenu}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} /></svg>
                      <span>{item.label}</span>
                      {item.active && (
                        <span aria-hidden="true" className="ml-auto h-2 w-2 rounded-full bg-brand-red" />
                      )}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="p-6 border-t border-gray-100 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{ft('mobileDrawerDesc')}</p>
                <div className="flex space-x-3">
                  <a aria-label={ft('bilibili')} href="https://space.bilibili.com/188894280" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-brand-red hover:bg-brand-red/10 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z" /></svg>
                  </a>
                  <a aria-label={ft('github')} href="https://github.com/F1Justin/SCTA-Homepage" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
                  </a>
                </div>
              </div>
        </>}
      </dialog>
    </header>
  );
}
