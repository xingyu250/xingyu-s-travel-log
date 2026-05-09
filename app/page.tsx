'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

const LeafletMap = dynamic(() => import('../components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-[#0a0a0a] flex items-center justify-center text-zinc-500 tracking-widest animate-pulse">正在唤醒旅行记忆...</div>
});

export default function Page() {
  const [mode, setMode] = useState<'entry' | 'map' | 'list'>('entry');

  if (mode === 'entry') {
    return (
      <main className="h-screen w-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-6 overflow-hidden relative">
        {/* 背景装饰：一个暗色的圆晕 */}
        <div className="absolute w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] -z-10" />
        
        <div className="text-center animate-in fade-in zoom-in duration-1000">
          <h1 className="text-5xl font-light mb-4 tracking-[0.2em] font-serif">星屿旅行志</h1>
          <div className="h-[1px] w-12 bg-zinc-500 mx-auto mb-6" />
          <p className="text-zinc-400 mb-16 tracking-[0.1em] text-sm uppercase">The Chronicle of Xingyu's Journey</p>
        </div>
        
        <div className="flex flex-col gap-6 w-full max-w-[280px]">
          <button 
            onClick={() => setMode('map')}
            className="group relative border border-zinc-700 py-4 px-8 overflow-hidden transition-all hover:border-white"
          >
            <span className="relative z-10 tracking-[0.3em] text-sm">探索地图</span>
            <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300" />
            <style jsx>{`.group:hover span { color: black; }`}</style>
          </button>
          
          <button 
            onClick={() => setMode('list')}
            className="text-zinc-500 hover:text-white transition-colors tracking-[0.2em] text-xs uppercase"
          >
            查看往昔足迹
          </button>
        </div>
        
        <div className="absolute bottom-12 flex items-center gap-2 text-[10px] text-zinc-600 tracking-widest uppercase">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping" />
          当前：山东 · 齐鲁大地
        </div>
      </main>
    );
  }

  // 地图模式（保持之前的结构，但在左上角增加了精致的返回键）
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <div className="absolute top-6 left-6 z-30">
        <button 
          onClick={() => setMode('entry')}
          className="group flex items-center gap-2 bg-black/40 backdrop-blur-xl text-white/70 px-5 py-2 border border-white/10 rounded-full text-xs tracking-tighter hover:text-white hover:border-white/40 transition-all"
        >
          <span>←</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">返回主轴</span>
        </button>
      </div>
      
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Sidebar />
        </div>
      </div>
      
      <div className="absolute inset-0 z-0">
        <LeafletMap />
      </div>
    </main>
  );
}
