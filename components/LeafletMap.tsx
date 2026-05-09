"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// 解决 Leaflet 在 Next.js 中图标不显示的经典 Bug
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function LeafletMap() {
  return (
    <div style={{ height: '100vh', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
      <MapContainer 
        center={[34.3416, 108.9398]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false} // 手机端建议关闭，防止遮挡
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" // 换成酷炫的深色地图，更符合你的风格
          attribution='&copy; OpenStreetMap'
        />
        <Marker position={[34.3416, 108.9398]}>
          <Popup>西安：旅行起点</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
