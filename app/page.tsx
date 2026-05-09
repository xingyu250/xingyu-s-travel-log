'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

const LeafletMap = dynamic(() => import('../components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-black flex items-center justify-center text-white">正在开启时空地图...</div>
});

export default function Page() {
  // mode 可以是 'entry' (入口), 'map' (看地图), 'list' (看足迹)
  const [mode, setMode] = useState<'entry' | 'map' | 'list'>('entry');

  // 入口界面
  if (mode === 'entry') {
    return (
      <main className="h-screen w-screen bg-black flex flex-col items-center justify-center text-white p-6 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-widest">星屿的旅行志</h1>
        <p className="text-zinc-500 mb-12 italic">“记录行走的每一个坐标”</p>
        
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button 
            onClick={() => setMode('map')}
            className="border border-white py-4 px-8 hover:bg-white hover:text-black transition-all duration-500 tracking-widest"
          >
            开启地图模式
          </button>
          
          <button 
            onClick={() => setMode('list')}
            className="border border-zinc-700 py-4 px-8 text-zinc-400 hover:border-white hover:text-white transition-all"
          >
            查看足迹列表
          </button>
        </div>
        
        <p className="absolute bottom-10 text-xs text-zinc-600">当前位置：山东</p>
      </main>
    );
  }

  // 足迹列表界面
  if (mode === 'list') {
    return (
      <main className="h-screen w-screen bg-zinc-950 text-white p-8">
        <button onClick={() => setMode('entry')} className="mb-8 text-zinc-500">← 返回</button>
        <h2 className="text-2xl font-bold mb-6 text-indigo-400">足迹清单</h2>
        <ul className="space-y-6">
          <li className="border-l-2 border-zinc-800 pl-4">
            <div className="text-lg font-bold">西安</div>
            <p className="text-zinc-500 text-sm">起点 · 长安旧梦</p>
          </li>
          <li className="border-l-2 border-indigo-500 pl-4">
            <div className="text-lg font-bold">山东</div>
            <p className="text-zinc-500 text-sm">目前停留 · 齐鲁大地</p>
          </li>
        </ul>
      </main>
    );
  }

  // 地图模式
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      <div className="absolute top-4 left-4 z-20">
        <button 
          onClick={() => setMode('entry')}
          className="bg-black/50 backdrop-blur-md text-white px-4 py-2 border border-white/20 rounded-full text-sm"
        >
          返回主菜单
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
