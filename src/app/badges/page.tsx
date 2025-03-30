'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';

// 定义徽章数据结构
interface Badge {
  id: string;
  name: string;
  schoolName: string;
  color: string;
  secondaryColor: string;
  logoPath: string;
  description: string;
}

// 徽章数据
const badges: Badge[] = [
  {
    id: 'tongji',
    name: '东方例会贡献勋章',
    schoolName: '同济大学',
    color: '#1a4b9c',
    secondaryColor: '#e2c053',
    logoPath: '/School-Logos/同济大学.png',
    description: '授予积极参与同济大学东方例会活动的社团成员，表彰其在弹幕文化传播与社团活动组织中的杰出贡献。'
  },
  {
    id: 'fudan',
    name: '弹幕大师勋章',
    schoolName: '复旦大学',
    color: '#8C1515',
    secondaryColor: '#38B2A6',
    logoPath: '/School-Logos/复旦大学.png',
    description: '授予在弹幕游戏中展现卓越技巧的复旦大学东方社团成员，表彰其对东方游戏的热爱与精通。'
  },
  {
    id: 'sjtuc',
    name: '创作之星勋章',
    schoolName: '上海交通大学',
    color: '#003876',
    secondaryColor: '#c53330',
    logoPath: '/School-Logos/上海交通大学.png',
    description: '授予在同人创作领域表现突出的上海交通大学东方社团成员，表彰其对东方文化传播的杰出贡献。'
  }
];

export default function BadgesPage() {
  const [loaded, setLoaded] = useState(false);
  
  useEffect(() => {
    setLoaded(true);
  }, []);
  
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="py-6 px-8 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首页
          </Link>
          <h1 className="text-2xl font-bold">社团成就徽章收藏</h1>
          <div className="w-20"></div> {/* 占位元素，保持标题居中 */}
        </div>
      </header>
      
      <main className="flex-grow p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-gray-400 max-w-2xl mx-auto">
              这些金属徽章代表了各高校东方社团成员在不同领域的卓越成就和贡献。
              每个徽章都蕴含着独特的意义和荣誉，是对社团成员热情和才华的肯定。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {badges.map((badge, index) => (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={`/badges/${badge.id}`} className="block">
                  <div className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-[#222] transition-all duration-300">
                    <div className="aspect-square relative overflow-hidden" style={{
                      background: `radial-gradient(circle at center, ${badge.color} 0%, #000000 100%)`
                    }}>
                      {/* 徽章预览 */}
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ perspective: 1000 }}
                      >
                        {/* 金属环 */}
                        <div className="w-52 h-52 relative">
                          {/* 外部金属边框 */}
                          <div className="absolute inset-0 rounded-full" style={{
                            background: `linear-gradient(135deg, ${badge.secondaryColor} 0%, #f5f5f5 25%, ${badge.secondaryColor} 50%, #f5f5f5 75%, ${badge.secondaryColor} 100%)`,
                            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                          }}></div>
                          
                          {/* 主体背景 */}
                          <div className="absolute inset-[4px] rounded-full flex items-center justify-center" style={{
                            background: badge.color,
                            boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.5)'
                          }}>
                            {/* 内部白色环 - 外圈 */}
                            <div className="absolute w-[85%] h-[85%] rounded-full" style={{
                              border: '3px solid rgba(255, 255, 255, 0.85)'
                            }}></div>
                            
                            {/* 内部白色环 - 内圈 */}
                            <div className="absolute w-[65%] h-[65%] rounded-full" style={{
                              border: '1.5px solid rgba(255, 255, 255, 0.6)'
                            }}></div>
                            
                            {/* 徽标图片 */}
                            <div className="w-[60%] h-[60%] relative z-10">
                              <Image 
                                src={badge.logoPath} 
                                alt={`${badge.schoolName}校徽`}
                                width={100}
                                height={100}
                                className="w-full h-full object-contain"
                                style={{
                                  filter: `drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))`
                                }}
                              />
                            </div>
                            
                            {/* 底部学校名称 */}
                            <div className="absolute bottom-[15%] text-center w-full">
                              <div className="text-white text-xs font-bold">
                                {badge.schoolName}
                              </div>
                              <div className="text-white text-[0.6rem] opacity-90">
                                {badge.name}
                              </div>
                            </div>
                          </div>
                          
                          {/* 光泽效果 */}
                          <div className="absolute inset-0 rounded-full overflow-hidden" style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)'
                          }}></div>
                        </div>
                      </div>
                      
                      {/* 悬停提示 */}
                      <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black bg-opacity-70 px-4 py-2 rounded-full text-white text-sm font-medium">
                          点击查看详情
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-2" style={{
                        color: badge.secondaryColor
                      }}>{badge.schoolName} · {badge.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-3">{badge.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              这是一个隐藏的私密页面，供内部成员欣赏收藏。更多社团徽章正在制作中...
            </p>
          </div>
        </div>
      </main>
    </div>
  );
} 