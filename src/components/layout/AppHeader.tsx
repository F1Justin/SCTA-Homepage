'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
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
          <h1 className="hidden sm:block text-xl font-bold text-gray-900 dark:text-white whitespace-nowrap">上海高校东方联合会</h1>
        </Link>

        <nav className="hidden md:flex space-x-2">
          <Link href="/" className="nav-link">首页</Link>
          <Link href="/activities" className="nav-link">活动</Link>
          <Link href="/activities-library" className="nav-link">活动方案库</Link>
          <Link href="/#schools" className="nav-link">成员社团</Link>
          <Link href="/#about" className="nav-link">关于我们</Link>
          <Link href="/#contact" className="nav-link">加入我们</Link>
        </nav>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-red"
          aria-label="Toggle navigation menu"
        >
          <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-50 md:hidden bg-white dark:bg-gray-900 p-4"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold dark:text-white">导航</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Close menu"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="nav-link-mobile" onClick={() => setIsMobileMenuOpen(false)}>首页</Link>
              <Link href="/activities" className="nav-link-mobile" onClick={() => setIsMobileMenuOpen(false)}>活动</Link>
              <Link href="/activities-library" className="nav-link-mobile" onClick={() => setIsMobileMenuOpen(false)}>活动方案库</Link>
              <Link href="/#schools" className="nav-link-mobile" onClick={() => setIsMobileMenuOpen(false)}>成员社团</Link>
              <Link href="/#about" className="nav-link-mobile" onClick={() => setIsMobileMenuOpen(false)}>关于我们</Link>
              <Link href="/#contact" className="nav-link-mobile" onClick={() => setIsMobileMenuOpen(false)}>加入我们</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
} 