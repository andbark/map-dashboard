'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icon issues in Next.js
// We need to override the default icon path which doesn't work well in Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
    
    // This is needed to fix the icon paths
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png'
    });
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

  // Log any issues with coordinates
  useEffect(() => {
    if (schools.length > 0) {
      console.log(`Map component received ${schools.length} schools`);
      const schoolsWithCoords = schools.filter(school => 
        school.latitude !== undefined && 
        school.longitude !== undefined && 
        !isNaN(parseFloat(school.latitude)) && 
        !isNaN(parseFloat(school.longitude))
      );
      console.log(`Map will display ${schoolsWithCoords.length} schools with valid coordinates`);
      
      // Log the first few schools with coordinates for debugging
      if (schoolsWithCoords.length > 0) {
        console.log('Sample schools with coordinates:', 
          schoolsWithCoords.slice(0, 3).map(s => ({
            name: s.name,
            lat: s.latitude,
            lng: s.longitude
          }))
        );
      }
      
      // Log any schools with invalid coordinates
      const schoolsWithInvalidCoords = schools.filter(school => 
        (school.latitude !== undefined || school.longitude !== undefined) &&
        (isNaN(parseFloat(school.latitude)) || isNaN(parseFloat(school.longitude)))
      );
      if (schoolsWithInvalidCoords.length > 0) {
        console.warn(`Found ${schoolsWithInvalidCoords.length} schools with invalid coordinates`);
        console.warn('Sample invalid coordinates:', 
          schoolsWithInvalidCoords.slice(0, 3).map(s => ({
            name: s.name,
            lat: s.latitude,
            lng: s.longitude
          }))
        );
      }
    }
  }, [schools]);

  if (!mapLoaded) {
    return (
      <div className="card h-[600px] flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  // Filter schools to only those with valid coordinates
  const schoolsToDisplay = schools.filter(school => 
    school.latitude !== undefined && 
    school.longitude !== undefined && 
    !isNaN(parseFloat(school.latitude)) && 
    !isNaN(parseFloat(school.longitude))
  );

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
          
          {schoolsToDisplay.map((school, index) => {
            // Ensure we're using floating point numbers for latitude and longitude
            const lat = parseFloat(school.latitude);
            const lng = parseFloat(school.longitude);
            
            // Double-check that coordinates are valid numbers
            if (isNaN(lat) || isNaN(lng)) {
              console.warn(`Invalid coordinates for school ${school.name}: [${school.latitude}, ${school.longitude}]`);
              return null;
            }
            
            return (
              <Marker 
                key={`${school.name}-${index}`}
                position={[lat, lng]}
                icon={DefaultIcon}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">{school.name}</h3>
                    <p>{school.address}</p>
                    <p>{school.city}, {school.state} {school.zipCode || school.zip}</p>
                    {school.district && <p>District: {school.district}</p>}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
} 