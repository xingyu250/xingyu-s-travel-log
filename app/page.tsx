'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// 动态加载地图：彻底禁用 SSR
const MapComponent = dynamic(() => import('../components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-black" />
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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-screen w-screen bg-black" />;

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      
      {/* 1. 盖在最上面的入口大门：点击后它会像帘子一样滑走 */}
      <div 
        className={`absolute inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
          hasEntered ? 'translate-y-[-100%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="absolute w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px]" />
        <h1 className="text-4xl md:text-6xl font-light mb-6 tracking-[0.2em] font-serif text-white text-center px-4">星屿的旅行志</h1>
        <div className="w-10 h-[1px] bg-white/20 mb-8" />
        <button 
          onClick={() => setHasEntered(true)}
          className="px-10 py-4 border border-white/10 text-white tracking-[0.4em] text-xs uppercase hover:bg-white hover:text-black transition-all duration-500"
        >
          开启探索
        </button>
      </div>

      {/* 2. 交互侧边栏：只有在大门打开后才真正显露 */}
      <div className={`absolute left-0 top-0 h-full w-[300px] bg-black/60 backdrop-blur-2xl border-r border-white/10 z-20 flex flex-col transition-all duration-700 delay-500 ${
        hasEntered ? 'translate-x-0 opacity-100' : 'translate-x-[-100%] opacity-0'
      }`}>
        <div className="p-8 border-b border-white/5">
          <button onClick={() => setHasEntered(false)} className="text-[10px] text-zinc-500 tracking-widest uppercase">← Back</button>
          <h2 className="text-xl font-serif tracking-[0.2em] mt-4 text-white uppercase">Footprints</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {TRAVEL_DATA.map((loc) => (
            <div 
              key={loc.id}
              onClick={() => setActiveLocation(loc)}
              className={`p-4 rounded-lg cursor-pointer transition-all border ${
                activeLocation?.id === loc.id ? 'bg-white/10 border-indigo-500/50' : 'bg-transparent border-white/5'
              }`}
            >
              <h3 className="text-sm font-bold tracking-widest text-white">{loc.name}</h3>
              <p className="text-[9px] text-indigo-400 mt-1 uppercase opacity-70">{loc.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 底层地图：它始终在那，永远不会被销毁，所以永远不会报错 */}
      <div className="absolute inset-0 z-0">
        <MapComponent locations={TRAVEL_DATA} activeLocation={activeLocation} />
      </div>

    </main>
  );
}
