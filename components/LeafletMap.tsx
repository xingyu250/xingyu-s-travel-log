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

