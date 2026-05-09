'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 动态加载地图：增加更多的安全保护
const MapComponent = dynamic(() => import('../components/LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center text-white">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
      <p className="tracking-widest text-xs text-zinc-500">正在同步地理坐标...</p>
    </div>
  )
});

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
  const [isMounted, setIsMounted] = useState(false);

  // 关键修复：确保组件在客户端完全挂载后再显示内容，防止 Client-side Exception
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-screen w-screen bg-black" />;

  // 1. 入口页面
  if (!hasEntered) {
    return (
      <main className="h-screen w-screen bg-[#050505] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="z-10 text-center flex flex-col items-center px-6">
          <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-[0.2em] font-serif">星屿的旅行志</h1>
          <div className="w-10 h-[px] bg-white/20 mb-8" />
          <p className="text-zinc-500 mb-12 tracking-[0.1em] text-sm font-light">"世界是一本书，而我正在翻阅它。"</p>
          <button 
            onClick={() => setHasEntered(true)}
            className="group relative px-10 py-4 border border-white/10 hover:border-white/50 transition-all duration-700 bg-white/5 text-white overflow-hidden"
          >
            <span className="relative z-10 tracking-[0.4em] text-xs uppercase group-hover:text-black transition-colors duration-500">开启探索</span>
            <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500" />
          </button>
        </div>
      </main>
    );
  }

  // 2. 地图 & 侧边栏
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black flex flex-col md:flex-row">
      {/* 侧边栏：手机端改为顶部浮动，更丝滑 */}
      <div className="absolute left-0 top-0 h-full w-full md:w-[320px] bg-black/60 backdrop-blur-2xl border-r border-white/10 z-20 flex flex-col pointer-events-none">
        <div className="p-8 border-b border-white/5 pointer-events-auto">
          <button onClick={() => setHasEntered(false)} className="text-[10px] text-zinc-500 hover:text-white transition-colors tracking-widest uppercase">
            ← Back to Cover
          </button>
          <h2 className="text-xl font-serif tracking-[0.2em] mt-4 text-white">我的足迹</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 pointer-events-auto">
          {TRAVEL_DATA.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => setActiveLocation(loc)}
              className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                activeLocation?.id === loc.id 
                  ? 'bg-white/10 border-indigo-500/50' 
                  : 'bg-transparent border-white/5 hover:bg-white/5'
              }`}
            >
              <h3 className="text-base font-bold tracking-wider text-white">{loc.name}</h3>
              <p className="text-[10px] text-indigo-400 mt-1 uppercase">{loc.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 全屏地图 */}
      <div className="absolute inset-0 z-0">
        <MapComponent locations={TRAVEL_DATA} activeLocation={activeLocation} />
      </div>
    </main>
  );
}
