"use client";
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 1. 定制高级感“呼吸光晕”标记点 (纯 CSS，不依赖外部图片)
const glowIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="width:16px;height:16px;background-color:#818cf8;border-radius:50%;border:2px solid white;box-shadow:0 0 15px rgba(129,140,248,0.8);animation:pulse 2s infinite;"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// 2. 地图飞行控制器：负责平滑移动到你点击的地点
const MapController = ({ targetPosition, zoomLevel }: { targetPosition: [number, number] | null, zoomLevel: number }) => {
  const map = useMap();
  useEffect(() => {
    if (targetPosition) {
      map.flyTo(targetPosition, zoomLevel, { duration: 1.5, easeLinearity: 0.25 });
    }
  }, [targetPosition, zoomLevel, map]);
  return null;
};

// 3. 接收页面传来的地点数据
export default function LeafletMap({ locations, activeLocation }: { locations: any[], activeLocation: any }) {
  // 默认视角中心（如果没选中任何地点，就看全中国）
  const defaultCenter: [number, number] = [35.0, 110.0];

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'absolute', top: 0, left: 0, zIndex: 0, backgroundColor: '#0a0a0a' }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // 隐藏默认放大缩小按钮，更美观
      >
        {/* 极简深色高级底图 */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        
        {/* 植入飞行控制器 */}
        <MapController 
          targetPosition={activeLocation ? activeLocation.position : defaultCenter} 
          zoomLevel={activeLocation ? 8 : 5} 
        />

        {/* 渲染所有你去过的地方 */}
        {locations.map((loc) => (
          <Marker key={loc.id} position={loc.position} icon={glowIcon}>
            <Popup closeButton={false}>
              <div style={{ width: '200px', padding: '4px', fontFamily: 'sans-serif' }}>
                <img 
                  src={loc.image} 
                  alt={loc.name} 
                  style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '10px' }} 
                />
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#111' }}>{loc.name}</h3>
                <p style={{ margin: '4px 0', fontSize: '12px', color: '#666' }}>{loc.date}</p>
                <p style={{ margin: 0, fontSize: '14px', color: '#333' }}>{loc.note}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
