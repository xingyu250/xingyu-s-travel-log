import React from 'react';
import { MapPin, Calendar, Camera } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-80 bg-stone-100 h-screen border-r border-stone-300 p-6 flex flex-col shadow-inner">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-800 tracking-tight">星屿的旅行志</h1>
        <p className="text-stone-500 text-sm italic mt-2">Travel Log & Map Interation</p>
      </div>
      
      <div className="space-y-6 flex-1">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-stone-200">
          <div className="flex items-center gap-2 mb-2 text-stone-700">
            <MapPin size={18} />
            <span className="font-medium">当前坐标</span>
          </div>
          <p className="text-sm text-stone-600 font-mono">点击地图标记以查看详情</p>
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-stone-200 text-stone-400 text-xs">
        <p>© 2026 Powered by Next.js & Vercel</p>
      </div>
    </div>
  );
};

export default Sidebar;
