'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

const LeafletMap = dynamic(() => import('@/components/LeafletMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-zinc-500 text-sm font-mono animate-pulse">INITIATING VOYAGE MAP...</p>
      </div>
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

  const flyToNode = (lat: number, lng: number) => {
    // 这里的逻辑由 LeafletMap 内部通过监听 window 自定义事件或 ref 实现
    const event = new CustomEvent('fly-to', { detail: { lat, lng } });
    window.dispatchEvent(event);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden bg-zinc-950 text-white">
      <LeafletMap />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.5)] z-10" />
      <div className="absolute left-6 top-6 bottom-6 w-80 z-[1000] pointer-events-none">
        <Sidebar nodes={nodes} onNodeClick={flyToNode} />
      </div>
    </main>
  );
}
'use client';

import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Check, Image as ImageIcon, X } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

const customIcon = L.divIcon({
  html: renderToStaticMarkup(<MapPin className="text-amber-500 fill-amber-500/20" size={32} />),
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const draftIcon = L.divIcon({
  html: renderToStaticMarkup(<MapPin className="text-amber-400 animate-pulse" size={32} />),
  className: 'custom-div-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

export default function LeafletMap() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [map, setMap] = useState<L.Map | null>(null);
  const [draftNode, setDraftNode] = useState<{lat: number, lng: number} | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('travel_logs');
    if (saved) setNodes(JSON.parse(saved));

    const handleFly = (e: any) => {
      if (map) map.flyTo([e.detail.lat, e.detail.lng], 14);
    };
    window.addEventListener('fly-to', handleFly);
    return () => window.removeEventListener('fly-to', handleFly);
  }, [map]);

  useEffect(() => {
    localStorage.setItem('travel_logs', JSON.stringify(nodes));
  }, [nodes]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImages(prev => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSaveNode = () => {
    if (!draftNode || !draftTitle.trim()) return;
    const newNode = {
      id: Date.now(),
      lat: draftNode.lat,
      lng: draftNode.lng,
      title: draftTitle,
      images: selectedImages,
      date: new Date().toLocaleString(),
    };
    setNodes([...nodes, newNode]);
    setDraftNode(null);
    setDraftTitle('');
    setSelectedImages([]);
  };

  function MapInteractionHandler() {
    useMapEvents({
      click(e) {
        setDraftNode({ lat: e.latlng.lat, lng: e.latlng.lng });
        setDraftTitle('');
        setSelectedImages([]);
      },
    });
    return null;
  }

  return (
    <MapContainer center={[35.5, 137.5]} zoom={6} zoomControl={false} ref={setMap} className="w-full h-full bg-zinc-900">
      <MapInteractionHandler />
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <ZoomControl position="bottomright" />
      {nodes.map((node) => (
        <Marker key={node.id} position={[node.lat, node.lng]} icon={customIcon}>
          <Popup>
            <div className="w-48 p-1 font-sans text-zinc-900">
              <h3 className="font-bold">{node.title}</h3>
              <div className="grid grid-cols-2 gap-1 mt-2">
                {node.images?.map((img: string, i: number) => (
                  <img key={i} src={img} className="w-full h-12 object-cover rounded" />
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      {draftNode && (
        <Marker position={[draftNode.lat, draftNode.lng]} icon={draftIcon}>
          <Popup closeButton={false} closeOnClick={false}>
            <div className="p-3 w-64 font-sans text-zinc-900">
              <input 
                type="text" 
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="站点名称" 
                className="w-full border-b mb-2 outline-none p-1"
              />
              <div className="flex gap-2 mb-2">
                {selectedImages.map((src, i) => <img key={i} src={src} className="w-8 h-8 object-cover rounded" />)}
                <button onClick={() => fileInputRef.current?.click()} className="w-8 h-8 border border-dashed flex items-center justify-center">+</button>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" multiple accept="image/*" onChange={handleImageChange} />
              <button onClick={handleSaveNode} className="w-full bg-zinc-900 text-white py-2 rounded text-xs font-bold">保存节点</button>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
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
