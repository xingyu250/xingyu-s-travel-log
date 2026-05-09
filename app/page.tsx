'use client';

import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

// 强制让 Loading 状态也占满空间，防止跳动
const LeafletMap = dynamic(() => import('../components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-white">
      <p>地图正在赶来的路上...</p>
    </div>
  )
});

export default function VoyageLogPage() {
  return (
    <main className="flex h-screen w-screen bg-black overflow-hidden">
      {/* 侧边栏：固定宽度 */}
      <div className="flex-none h-full">
        <Sidebar />
      </div>
      
      {/* 地图区域：强制占满剩余所有空间 */}
      <div className="flex-grow h-full w-full relative">
        <LeafletMap />
      </div>
    </main>
  );
}
