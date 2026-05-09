'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const LeafletMap = dynamic(() => import('../components/LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
    </div>
  )
});

export default function VoyageLogPage() {
  const [nodes, setNodes] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('travel_logs');
    if (saved) setNodes(JSON.parse(saved));

    const handleStorageChange = () => {
      const updated = localStorage.getItem('travel_logs');
      if (updated) setNodes(JSON.parse(updated));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <main className="relative w-full h-screen bg-black overflow-hidden">
      <LeafletMap />
      <Sidebar nodes={nodes} />
    </main>
  );
}
