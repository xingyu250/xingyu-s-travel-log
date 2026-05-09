'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// 动态加载地图，防止 Next.js 服务端渲染报错，同时自带一个高级的加载画面
const MapComponent = dynamic(() => import('../components/LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white relative">
      <div className="w-12 h-12 border-t-2 border-indigo-500 border-solid rounded-full animate-spin mb-4"></div>
      <p className="tracking-[0.3em] text-sm text-zinc-400">正在重构时空坐标...</p>
    </div>
  )
});

// 核心旅行数据：你想增加新地点，只需要在这里加一行
const TRAVEL_DATA = [
  {
    id: 'xian',
    name: '西安',
    date: '2023 - 旅程起点',
    position: [34.3416, 108.9398] as [number, number],
    note: '十三朝古都，梦开始的地方。',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d13214f?q=80&w=400&auto=format&fit=crop'
  },
  {
    id: 'shandong',
    name: '山东',
    date: 'Present - 当前停留',
    position: [36.6683, 117.0204] as [number, number],
    note: '齐鲁大地，海风与山河的交响。',
    image: 'https://images.unsplash.com/photo-1621841364539-7bd09e3e3bba?q=80&w=400&auto=format&fit=crop'
  }
];

export default function VoyageLogPage() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeLocation, setActiveLocation] = useState<any>(null);

  // 1. 高级入口页面
  if (!hasEntered) {
    return (
      <main className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden">
        {/* 背景氛围光 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-900/20 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="z-10 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-[0.25em] font-serif">星屿的旅行志</h1>
          <div className="w-10 h-[1px] bg-white/30 mb-8" />
          <p className="text-zinc-400 mb-16 tracking-[0.15em] text-sm md:text-base font-light">"世界是一本书，而我正在翻阅它。"</p>
          
          <button 
            onClick={() => setHasEntered(true)}
            className="group relative px-8 py-4 border border-white/20 hover:border-white/80 transition-all duration-700 bg-black/50 backdrop-blur-sm overflow-hidden"
          >
            <span className="relative z-10 tracking-[0.3em] text-sm group-hover:text-black transition-colors duration-500">开启探索</span>
            <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" />
          </button>
        </div>
      </main>
    );
  }

  // 2. 地图 & 交互侧边栏页面
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black flex">
      
      {/* 左侧：磨砂玻璃质感的侧边栏 (PC端占300px，移动端占底部或浮动) */}
      <div className="absolute left-0 top-0 h-full w-[320px] bg-black/60 backdrop-blur-2xl border-r border-white/10 z-20 flex flex-col transform transition-transform duration-500 text-white shadow-2xl">
        
        {/* 侧边栏头部 */}
        <div className="p-8 border-b border-white/10">
          <button onClick={() => setHasEntered(false)} className="text-xs text-zinc-500 hover:text-white transition-colors mb-4 tracking-widest">
            ← 返回封面
          </button>
          <h2 className="text-2xl font-serif tracking-widest mt-2">我的足迹</h2>
        </div>

        {/* 侧边栏列表：点击地点，地图自动飞行 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {TRAVEL_DATA.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => setActiveLocation(loc)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-300 border ${
                activeLocation?.id === loc.id 
                  ? 'bg-white/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                  : 'bg-transparent border-white/5 hover:bg-white/5'
              }`}
            >
              <h3 className="text-lg font-bold tracking-wider">{loc.name}</h3>
              <p className="text-xs text-indigo-400 mt-1">{loc.date}</p>
              <p className="text-sm text-zinc-400 mt-3 line-clamp-2">{loc.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧/底层：全屏地图 */}
      <div className="absolute inset-0 z-0">
        <MapComponent locations={TRAVEL_DATA} activeLocation={activeLocation} />
      </div>

    </main>
  );
}
