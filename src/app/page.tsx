'use client';

import { getActivities } from '@/lib/contentful';
import { schools } from '@/data/schools';
import ActivityCard from '@/components/ActivityCard';
import SchoolCard from '@/components/SchoolCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Activity } from '@/lib/contentful';
import Image from 'next/image';
import Masonry from 'react-masonry-css';

// 定义 Masonry 的响应式断点
const masonryBreakpointsHomepage = {
  default: 3,    // 默认（宽屏）显示 3 列
  640: 2        // 屏幕宽度 <= 640px 时显示 2 列
};

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities().then(fetchedActivities => {
      const sortedByDate = [...fetchedActivities].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      const itemsToDisplay = sortedByDate.slice(0, 6);
      
      // 关键日志：检查传递给 state 的最终数据
      console.log('[HomePage] FINAL 6 activities to render (Date Sorted):', JSON.parse(JSON.stringify(itemsToDisplay)));
      
      setActivities(itemsToDisplay);
    }).catch(error => {
      console.error("Error fetching homepage activities:", error);
      // 您可以在此处设置错误状态并在 UI 中显示错误信息
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - 重新设计 */}
      <section className="relative min-h-[93vh] bg-white dark:bg-gray-900 overflow-hidden flex items-center justify-center">
        {/* 背景装饰元素 */}
        <div className="absolute inset-0 overflow-hidden">
          {/* 背景图案 - 几何图形 */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-red dark:text-red-400" />
                </pattern>
                <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                  <rect width="100" height="100" fill="url(#smallGrid)" />
                  <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="1" className="text-brand-red dark:text-red-400" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* 装饰圆形 */}
          <motion.div 
            className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-brand-red opacity-5 dark:opacity-10"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 8, 
              ease: "easeInOut", 
              repeat: Infinity 
            }}
          />
          <motion.div 
            className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-brand-gold opacity-5 dark:opacity-10"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              duration: 10, 
              ease: "easeInOut", 
              repeat: Infinity,
              delay: 1
            }}
          />
          <motion.div 
            className="absolute top-1/3 right-1/4 w-64 h-64 rounded-full bg-brand-blue opacity-5 dark:opacity-10"
            animate={{ 
              scale: [1, 1.15, 1],
              y: [0, 15, 0]
            }}
            transition={{ 
              duration: 12, 
              ease: "easeInOut", 
              repeat: Infinity,
              delay: 2
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 -mt-16 sm:-mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            {/* 文字内容 */}
            <motion.div
              className="w-full md:max-w-2xl order-2 md:order-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4 sm:mb-6 text-center md:text-left"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-brand-red dark:text-red-400">幻想乡</span>的弹幕
                <br />
                <span className="text-brand-blue dark:text-blue-400">现实中</span>的交流
              </motion.h1>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 border-l-4 border-brand-gold pl-4 text-center md:text-left mx-auto md:mx-0 max-w-lg md:max-w-none">
                  地处上海爱丽丝幻乐团字面上的应许之地（雾），
                  上海高校东方联合会致力于连接各高校东方Project爱好者，
                  促进同人创作交流，共同享受幻想乡的魅力。
                  <span className="text-brand-red font-semibold">幻想乡的大门向所有人敞开</span>，
                  不仅仅是上海高校的莘莘学子，更欢迎<span className="text-brand-blue font-semibold">全国各地的东方爱好者</span>，
                  无论您是学生、上班族还是自由创作者，这里都有属于您的弹幕世界！
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-row justify-center md:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <motion.a 
                  href="#about" 
                  className="px-6 py-3 rounded-md bg-brand-red text-white font-medium hover:bg-opacity-90 transition-all duration-300 text-center shadow-lg shadow-brand-red/20 hover:shadow-xl hover:shadow-brand-red/30 hover:-translate-y-1 min-w-[120px] sm:min-w-[140px]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  了解更多
                </motion.a>
                <motion.a 
                  href="#activities" 
                  className="px-6 py-3 rounded-md bg-white dark:bg-gray-800 border-2 border-brand-blue text-brand-blue dark:text-blue-400 font-medium hover:bg-brand-blue/5 transition-all duration-300 text-center hover:-translate-y-1 min-w-[120px] sm:min-w-[140px]"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  探索活动
                </motion.a>
              </motion.div>
            </motion.div>
            
            {/* 标志/图片 */}
            <motion.div
              className="w-full md:w-auto md:flex-shrink-0 relative order-1 md:order-2 mb-8 md:mb-0"
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 15,
                delay: 0.3 
              }}
            >
              <div className="p-6 max-w-[220px] sm:max-w-[280px] md:max-w-[320px] lg:max-w-[380px] mx-auto">
                <div className="relative">
                  {/* 装饰元素 - 圆点和线条 */}
                  <motion.div 
                    className="absolute -top-4 -left-4 w-16 h-16 sm:w-24 sm:h-24 border-t-4 border-l-4 border-brand-gold opacity-50"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -bottom-4 -right-4 w-16 h-16 sm:w-24 sm:h-24 border-b-4 border-r-4 border-brand-blue opacity-50"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  />
                  <motion.div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full border-4 border-dashed border-brand-red/30 -z-10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                  />
                  
                  {/* 主标志 */}
                  <motion.div
                    whileHover={{ scale: 1.02, rotate: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Image 
                      src="/Logos/submark_1栅格版彩色带边距.png" 
                      alt="上海高校东方联合会徽标" 
                      width={500}
                      height={500}
                      className="w-full h-auto drop-shadow-xl relative z-10" 
                      priority
                    />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* 向下滚动指示器 */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p className="text-gray-500 dark:text-gray-400 mb-2 text-sm">向下滚动</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <svg className="w-6 h-6 text-brand-red dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title dark:text-white">关于<span className="text-brand-red dark:text-red-400">我们</span></h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-center mb-8 text-gray-700 dark:text-gray-300">
                上海高校东方联合会成立于2023年11月，是连接上海各高校东方Project爱好者的纽带。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
                {/* 活动方案库宣传 */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-brand-red dark:text-red-400">活动方案库</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
                      我们收集整理了各类东方同好活动的策划方案，为高校社团提供活动组织参考。
                      您也可以贡献自己的创意，帮助更多社团举办精彩活动！
                    </p>
                    <div className="flex flex-wrap gap-4 mt-auto">
                      <Link 
                        href="/activities-library" 
                        className="inline-flex items-center px-4 py-2 bg-brand-red text-white rounded-md hover:bg-opacity-90 transition-all"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        浏览方案库
                      </Link>
                      <a 
                        href="https://docs.qq.com/form/page/DQk1MaEpLQm9HbnRU#/fill" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-brand-gold text-brand-gold dark:text-yellow-400 rounded-md hover:bg-brand-gold/5 transition-all"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        贡献方案
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* 关注我们卡片 */}
                <div className="bg-white dark:bg-gray-700 rounded-xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-brand-blue dark:text-blue-400">关注我们</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
                      在B站关注我们获取最新的活动视频和东方Project相关内容，
                      或者在GitHub上为我们的网站提出改进建议，一起让上海高校东方联合会变得更好！
                    </p>
                    <div className="flex flex-wrap justify-center gap-6 mt-auto">
                      <a 
                        href="https://space.bilibili.com/188894280" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group"
                      >
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 flex items-center justify-center rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 mb-2">
                          <svg className="w-8 h-8 text-[#fb7299] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .355-.124.657-.373.906zM5.333 7.24c-.746.018-1.373.276-1.88.773-.506.498-.769 1.13-.786 1.894v7.52c.017.764.28 1.395.786 1.893.507.498 1.134.756 1.88.773h13.334c.746-.017 1.373-.275 1.88-.773.506-.498.769-1.129.786-1.893v-7.52c-.017-.765-.28-1.396-.786-1.894-.507-.497-1.134-.755-1.88-.773zM8 11.107c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c0-.373.129-.689.386-.947.258-.257.574-.386.947-.386zm8 0c.373 0 .684.124.933.373.25.249.383.569.4.96v1.173c-.017.391-.15.711-.4.96-.249.25-.56.374-.933.374s-.684-.125-.933-.374c-.25-.249-.383-.569-.4-.96V12.44c.017-.391.15-.711.4-.96.249-.249.56-.373.933-.373z"/>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">哔哩哔哩</span>
                      </a>
                      <a 
                        href="https://github.com/F1Justin/SCTA-Homepage" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex flex-col items-center group"
                      >
                        <div className="w-14 h-14 bg-white dark:bg-gray-800 flex items-center justify-center rounded-full shadow-md group-hover:shadow-lg transition-all duration-300 mb-2">
                          <svg className="w-8 h-8 text-gray-800 dark:text-white group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.237 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">GitHub</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20 bg-white dark:bg-gray-900 relative">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title dark:text-white mb-12">近期<span className="text-brand-red dark:text-red-400">活动</span></h2>
            
            <div className="relative">
              <Masonry
                breakpointCols={masonryBreakpointsHomepage}
                className="flex w-auto -mx-2 sm:-mx-4"
                columnClassName="px-2 sm:px-4"
              >
                {activities.map((activity, index) => (
                  <div key={activity.id} className="mb-4 sm:mb-8">
                    <ActivityCard activity={activity} index={index} />
                  </div>
                ))}
              </Masonry>

              {/* 保持渐变遮罩和查看更多按钮不变 */}
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900 pointer-events-none"></div>
              <div className="absolute bottom-48 left-0 right-0 flex justify-center">
                <Link href="/activities" className="btn-primary z-10">
                  查看更多活动
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Schools Section */}
      <section id="schools" className="py-8 -mt-48 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 relative z-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="pt-8"
          >
            <h2 className="section-title dark:text-white">成员<span className="text-brand-blue dark:text-blue-400">社团</span></h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {schools.map((school) => (
                <SchoolCard 
                  key={school.id} 
                  school={school}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-r from-brand-blue to-brand-red text-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">加入我们</h2>
            <p className="text-lg mb-8 opacity-90">
              无论你是东方Project的老玩家，还是刚刚了解幻想乡的新人，
              我们都欢迎你的加入！一起探索这个奇妙的弹幕世界吧！
            </p>
            <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm">
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <Image
                    src="/scta-qrcode.png"
                    alt="上海高校东方联合会QQ群二维码"
                    width={192}
                    height={192}
                    className="object-contain"
                  />
                </div>
                <p className="text-lg opacity-90">扫描二维码加入上海高校东方联合会</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 