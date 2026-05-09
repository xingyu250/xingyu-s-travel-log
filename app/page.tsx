'use client';
import dynamic from 'next/dynamic';
import Sidebar from '../components/Sidebar';

// 动态加载，彻底关掉服务端渲染，防止 window is not defined 报错
const LeafletMap = dynamic(() => import('../components/LeafletMap'), { 
  ssr: false,
  loading: () => <div className="h-screen w-screen bg-zinc-900 flex items-center justify-center text-white">地图准备中...</div>
});

export default function Page() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* 侧边栏层级提高，压在地图上面 */}
      <div className="relative z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <Sidebar />
        </div>
      </div>
      
      {/* 地图铺满底层 */}
      <div className="absolute inset-0 z-0">
        <LeafletMap />
      </div>
    </main>
  );
}
