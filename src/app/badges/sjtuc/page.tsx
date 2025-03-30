'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function SJTUCBadgePage() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [lastRotation, setLastRotation] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50 });

  // 处理鼠标按下
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setLastRotation({ ...rotation });
  };

  // 处理鼠标移动
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !badgeRef.current) return;
    
    // 只计算水平方向的旋转
    const deltaX = e.clientX - startPosition.x;
    
    setRotation({
      x: lastRotation.x,
      y: lastRotation.y + deltaX * 0.5 // 只在水平方向旋转
    });
    
    // 设置光泽
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const shineX = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const shineY = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      setShine({ x: shineX, y: shineY });
    }
  };

  // 处理鼠标释放
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理鼠标离开
  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // 注册全局鼠标事件
  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <header className="py-6 px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/badges" className="text-lg font-semibold text-green-400 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回徽章列表
          </Link>
          <h1 className="text-xl font-bold">上海交通大学创作之星勋章</h1>
        </div>
      </header>
      
      <main 
        ref={containerRef}
        className="flex-grow flex flex-col items-center justify-center px-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          background: 'radial-gradient(circle at center, #121212 0%, #000000 100%)'
        }}
      >
        <div 
          ref={badgeRef}
          className="w-80 h-80 relative cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              perspective: 1200,
              transformStyle: 'preserve-3d'
            }}
            animate={{
              rotateX: rotation.x,
              rotateY: rotation.y
            }}
            transition={{ 
              type: 'spring', 
              stiffness: 300, 
              damping: 30,
              mass: 1.2 
            }}
          >
            {/* 徽章侧边厚度部分 */}
            <div className="absolute w-full h-full rounded-full" style={{
              background: 'linear-gradient(to right, #871f1d, #c53330, #ff8a87, #c53330, #871f1d)',
              transform: 'translateZ(-4px) scale(1.02)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.4)'
            }}></div>
            
            {/* 徽章背面 */}
            <div className="absolute w-full h-full rounded-full" style={{
              background: 'linear-gradient(135deg, #871f1d 0%, #c53330 100%)',
              transform: 'translateZ(-5px) scale(1.01)',
              boxShadow: '0 5px 20px rgba(0, 0, 0, 0.6)'
            }}></div>
            
            {/* 外部金属环 */}
            <div className="absolute w-full h-full rounded-full" style={{
              background: 'linear-gradient(135deg, #c53330 0%, #ff8a87 25%, #c53330 50%, #ff8a87 75%, #c53330 100%)',
              boxShadow: '0 0 10px rgba(0, 0, 0, 0.6), inset 0 0 10px rgba(255, 255, 255, 0.3)',
              transform: 'scale(1.01)'
            }}></div>
            
            {/* 主体背景圆盘 */}
            <div className="absolute w-[96%] h-[96%] rounded-full" style={{
              background: 'linear-gradient(135deg, #002454 0%, #003876 100%)',
              boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.6)',
              transform: 'translateZ(0.5px)'
            }}></div>
            
            {/* 内部白色环 - 外圈 */}
            <div className="absolute w-[80%] h-[80%] rounded-full" style={{
              border: '3px solid rgba(255, 255, 255, 0.85)',
              transform: 'translateZ(0.8px)',
              boxShadow: '0 0 8px rgba(255, 255, 255, 0.2)'
            }}></div>
            
            {/* 内部白色环 - 内圈 */}
            <div className="absolute w-[60%] h-[60%] rounded-full" style={{
              border: '1.5px solid rgba(255, 255, 255, 0.7)',
              transform: 'translateZ(1px)',
              boxShadow: 'inset 0 0 5px rgba(255, 255, 255, 0.1)'
            }}></div>
            
            {/* 光泽效果层 */}
            <div className="absolute w-full h-full rounded-full overflow-hidden pointer-events-none" style={{
              background: `radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)`,
              transform: 'translateZ(1.2px)'
            }}></div>
            
            {/* 学校徽标 */}
            <div
              className="w-full h-full flex items-center justify-center absolute"
              style={{ transform: 'translateZ(1.3px)' }}
            >
              {/* 使用学校徽标图片 */}
              <div className="w-[85%] h-[85%] flex items-center justify-center overflow-hidden rounded-full">
                <Image 
                  src="/School-Logos/上海交通大学.png" 
                  alt="上海交通大学校徽" 
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  style={{
                    filter: 'drop-shadow(0 0 5px rgba(197, 51, 48, 0.5))'
                  }}
                />
              </div>
            </div>
            
            {/* 底部文字 */}
            <div className="absolute bottom-8 text-center w-full" style={{
              transform: 'translateZ(1.4px)'
            }}>
              <div className="text-white text-xl font-bold mb-1" style={{
                textShadow: '0 1px 3px rgba(0, 0, 0, 0.7)'
              }}>上海交通大学</div>
              <div className="text-white text-sm opacity-90" style={{
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.7)'
              }}>创作之星勋章</div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-3 text-red-500" style={{
            textShadow: '0 0 10px rgba(197, 51, 48, 0.3)'
          }}>创作之星勋章</h2>
          <p className="text-gray-400 mb-6">
            此勋章授予在同人创作领域表现突出的上海交通大学东方社团成员，
            表彰其对东方文化传播的杰出贡献。
          </p>
          <div className="flex justify-center gap-3 text-xs text-gray-500">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block rounded-full bg-blue-800 mr-1"></span>
              深蓝色 - 上海交通大学校色
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block rounded-full bg-red-500 mr-1"></span>
              红色 - 创作热情
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 