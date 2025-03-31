'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues in Next.js
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  shadowUrl: '/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Helper component to recenter the map when viewport changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

export default function Map({ schools = [], selectedSchool, viewport, setViewport }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const defaultCenter = [39.8283, -98.5795]; // Center of US
  const defaultZoom = 4;

  useEffect(() => {
    // Set mapLoaded to true after component mount
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    // When a school is selected, update the viewport to focus on it
    if (selectedSchool && selectedSchool.latitude && selectedSchool.longitude) {
      setViewport({
        center: [parseFloat(selectedSchool.latitude), parseFloat(selectedSchool.longitude)],
        zoom: 13
      });
    }
  }, [selectedSchool, setViewport]);

  if (!mapLoaded) {
    return (
      <div className="card h-[600px] flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="h-[600px] w-full">
        <MapContainer
          center={viewport?.center || defaultCenter}
          zoom={viewport?.zoom || defaultZoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <ChangeView 
            center={viewport?.center || defaultCenter} 
            zoom={viewport?.zoom || defaultZoom} 
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {schools
            .filter(school => school.latitude && school.longitude)
            .map((school, index) => (
              <Marker 
                key={`${school.name}-${index}`}
                position={[parseFloat(school.latitude), parseFloat(school.longitude)]}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">{school.name}</h3>
                    <p>{school.address}</p>
                    <p>{school.city}, {school.state} {school.zip}</p>
                    {school.district && <p>District: {school.district}</p>}
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
} 