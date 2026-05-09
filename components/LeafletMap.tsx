"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// 定义你去过的地方
const locations = [
  { id: 1, name: "西安", position: [34.3416, 108.9398], note: "我的旅行起点。" },
  { id: 2, name: "山东", position: [36.6683, 117.0204], note: "当前所在地，探索中..." },
];

export default function LeafletMap() {
  return (
    <div style={{ height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0 }}>
      <MapContainer 
        center={[35.5, 113.0]} // 稍微调整中心点，让西安和山东都能看到
        zoom={6} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        
        {locations.map(loc => (
          <Marker key={loc.id} position={loc.position as [number, number]}>
            <Popup>
              <div className="text-zinc-800">
                <h3 className="font-bold">{loc.name}</h3>
                <p>{loc.note}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
