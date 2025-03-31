import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { School, MapViewport } from '@/types';

// Custom component to update map view when props change
function ChangeView({ center, zoom }: MapViewport) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  schools: School[];
  viewport: MapViewport;
}

export default function Map({ schools, viewport }: MapProps) {
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Fix Leaflet icon issues with Next.js
  useEffect(() => {
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
    });
    
    setIsMapInitialized(true);
  }, []);

  if (!isMapInitialized) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-50">
        <p className="text-black">Initializing map...</p>
      </div>
    );
  }

  const schoolsWithCoordinates = schools.filter(school => 
    school.latitude !== undefined && school.longitude !== undefined
  );

  return (
    <MapContainer
      center={viewport.center}
      zoom={viewport.zoom}
      style={{ height: '100%', width: '100%', minHeight: '600px' }}
      className="z-0"
    >
      <ChangeView center={viewport.center} zoom={viewport.zoom} />
      
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {schoolsWithCoordinates.map((school) => (
        <Marker 
          key={school.id || `${school.name}-${school.address}`}
          position={[school.latitude!, school.longitude!]}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-black">{school.name}</h3>
              <p className="text-sm text-gray-700 mt-1">{school.district}</p>
              <p className="text-sm text-gray-900">{school.address}</p>
              <p className="text-sm text-gray-900">{school.city}, {school.state} {school.zipCode}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
} 