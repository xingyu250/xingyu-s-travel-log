'use client';

import { MapPin, Navigation } from 'lucide-react';

interface SidebarProps {
  nodes: any[];
  onNodeClick: (lat: number, lng: number) => void;
}

export default function Sidebar({ nodes, onNodeClick }: SidebarProps) {
  return (
    <div className="h-full bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col text-white shadow-2xl pointer-events-auto overflow-hidden">
      <header className="mb-8 shrink-0">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <Navigation size={20} className="text-amber-500" />
          Voyage Log
        </h1>
      </header>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {nodes.map((node, idx) => (
          <div key={node.id} onClick={() => onNodeClick(node.lat, node.lng)} className="relative pl-8 pb-6 border-l border-white/10 group cursor-pointer last:pb-0">
            <div className="absolute left-[-5px] top-1 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-amber-400 transition-all" />
            <div className="font-medium text-zinc-200 group-hover:text-amber-400 transition-colors">{node.title}</div>
            <div className="text-[10px] text-zinc-500">{node.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

