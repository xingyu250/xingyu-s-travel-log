'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

// 使用 ../ 这种路径在你的层级结构下最保险
const LeafletMap = dynamic(() => import('../components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      <p className="ml-3">地图加载中...</p>
    </div>
  )
});

export default function VoyageLogPage() {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('travel_log_nodes');
    if (saved) setNodes(JSON.parse(saved));
  }, []);

  return (
    <main className="relative w-full h-screen bg-black flex overflow-hidden">
      {/* 侧边栏 */}
      <Sidebar />
      
      {/* 地图区域 */}
      <div className="flex-1 h-full relative">
        <LeafletMap />
      </div>
    </main>
  );
}
