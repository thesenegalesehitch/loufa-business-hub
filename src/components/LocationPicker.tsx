import { useEffect, useState, useCallback, memo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationMarkerProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}

// Separate component for handling map events - must be inside MapContainer
const LocationMarker = memo(function LocationMarker({ onLocationSelect }: LocationMarkerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  useEffect(() => {
    map.locate();
  }, [map]);

  if (!position) return null;
  
  return <Marker position={position} />;
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number } | null) => void;
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  // Dakar, Senegal coordinates
  const defaultCenter: [number, number] = [14.6937, -17.4441];

  const handleLocationSelect = useCallback((location: { lat: number; lng: number }) => {
    onLocationSelect(location);
  }, [onLocationSelect]);

  return (
    <div>
      <div className="h-64 rounded-xl overflow-hidden border">
        <MapContainer
          center={defaultCenter}
          zoom={12}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker onLocationSelect={handleLocationSelect} />
        </MapContainer>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Cliquez sur la carte pour indiquer votre position exacte
      </p>
    </div>
  );
}

interface StaticLocationMapProps {
  center: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  className?: string;
}

export function StaticLocationMap({ center, zoom = 15, markerPosition, className }: StaticLocationMapProps) {
  return (
    <div className={`h-64 rounded-xl overflow-hidden border ${className || ''}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full"
        scrollWheelZoom={true}
        dragging={true}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPosition && <Marker position={markerPosition} />}
      </MapContainer>
    </div>
  );
}
