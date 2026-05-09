"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 修复图标问题
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LeafletMap = () => {
  return (
    // 关键点：强制设定高度为 100vh (视口高度)
    <div style={{ height: '100vh', width: '100%', position: 'relative', backgroundColor: '#111' }}>
      <MapContainer 
        center={[34.3416, 108.9398]} 
        zoom={5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[34.3416, 108.9398]} icon={icon}>
          <Popup>
            <div style={{ color: '#333' }}>
              <h3 className="font-bold">西安</h3>
              <p>我的旅行起点。</p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
