"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// 修复 Leaflet 默认图标在 Next.js 中的显示问题
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LeafletMap = () => {
  return (
    <div className="h-full w-full bg-stone-200 relative">
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
            <div className="font-serif">
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
