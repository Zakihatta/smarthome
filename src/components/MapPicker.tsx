// src/components/MapPicker.tsx
'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix ikon marker Leaflet yang sering error di Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Komponen Helper untuk menangani Klik di Peta
function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: { lat: number; lng: number } | null; 
  setPosition: (pos: { lat: number; lng: number }) => void;
}) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

export default function MapPicker({ 
  onLocationSelect 
}: { 
  onLocationSelect: (lat: number, lng: number) => void 
}) {
  // Default posisi: Monas Jakarta (bisa diganti ke Padang defaultnya)
  // Padang: -0.9471, 100.4172
  const defaultCenter = { lat: -0.9471, lng: 100.4172 }; 
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);

  const handleSetPosition = (pos: { lat: number; lng: number }) => {
    setPosition(pos);
    onLocationSelect(pos.lat, pos.lng); // Kirim data ke parent
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-300">Pilih Lokasi di Peta</label>
      <div className="h-64 w-full rounded-xl overflow-hidden border border-white/10 relative z-0">
        <MapContainer 
          center={defaultCenter} 
          zoom={13} 
          scrollWheelZoom={false} 
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={handleSetPosition} />
        </MapContainer>
      </div>
      {position && (
        <p className="text-xs text-primary">
          Lokasi terpilih: {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </p>
      )}
    </div>
  );
}