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

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    getActivities().then(activities => {
      // 1. 按日期降序排序
      const sortedByDate = activities.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // 2. 仅处理前6个活动
      const itemsToDisplay = sortedByDate.slice(0, 6);
      
      // 3. 重新排序为水平方向优先 (让 CSS columns 正确填充)
      const numColumns = 3; // 基于最大列数计算
      const numRows = Math.ceil(itemsToDisplay.length / numColumns);
      const result = [];
      for (let col = 0; col < numColumns; col++) {
        for (let row = 0; row < numRows; row++) {
          const index = row * numColumns + col;
          if (index < itemsToDisplay.length) {
            result.push(itemsToDisplay[index]);
          }
        }
      }
      
      setActivities(result); // 设置重排后的数组
    });
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] bg-gradient-to-r from-brand-red to-brand-gold flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: "url('/hero-bg.jpg')" }}
          ></div>
        </div>
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
                幻想乡的弹幕
                <br />
                现实中的交流
              </h1>
              <p className="text-xl text-white opacity-90 mb-8">
                地处上海爱丽丝幻乐团字面上的应许之地（雾），
                上海高校东方联合会致力于连接各高校东方Project爱好者，
                促进同人创作交流，共同享受幻想乡的魅力。
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#about" className="btn-primary">了解更多</a>
                <a href="#activities" className="px-6 py-2 rounded-md bg-white text-brand-red font-medium hover:bg-opacity-90 transition-all duration-300">
                  探索活动
                </a>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 md:mt-0 max-w-sm md:max-w-md"
            >
              <div className="p-4">
                <Image 
                  src="/Logos/submark_1栅格版彩色带边距.png" 
                  alt="上海高校东方联合会徽标" 
                  width={500}
                  height={500}
                  className="w-full h-auto" 
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
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
                我们致力于推广东方Project文化，组织各类同好活动，促进各校社团的交流与合作，
                共同探索ZUN创作的奇妙世界。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 my-12">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-brand-red rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">游戏与二创</h3>
                  <p className="text-gray-600 dark:text-gray-400">组织原作游戏交流与对战活动，支持各种形式的二次创作展示。</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-brand-gold rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">交流与合作</h3>
                  <p className="text-gray-600 dark:text-gray-400">促进各高校东方社团间的交流与合作，举办联合展会和比赛，分享资源和经验。</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-brand-blue rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2 dark:text-white">文化推广</h3>
                  <p className="text-gray-600 dark:text-gray-400">向更多人介绍东方Project的魅力，通过展会、讲座等活动，让更多人了解这个神奇的幻想世界。</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Activities Section */}
      <section id="activities" className="py-20">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title dark:text-white">活动<span className="text-brand-gold dark:text-yellow-400">展示</span></h2>
            <div className="relative">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [column-fill:_balance]">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="break-inside-avoid mb-8 inline-block w-full">
                    <ActivityCard activity={activity} index={index} />
                  </div>
                ))}
              </div>
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
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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