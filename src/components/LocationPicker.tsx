import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onLocationSelect: (location: { lat: number; lng: number } | null) => void;
  initialPosition?: { lat: number; lng: number } | null;
  interactive?: boolean;
}

function LocationMarker({ onLocationSelect, interactive = true }: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const map = useMap();

  useMapEvents({
    click(e) {
      if (!interactive) return;
      setPosition(e.latlng);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    locationfound(e) {
      if (!interactive) return;
      setPosition(e.latlng);
      map.flyTo(e.latlng, 15);
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  // Try to get user location on mount
  useEffect(() => {
    if (interactive) {
      map.locate();
    }
  }, [map, interactive]);

  return position === null ? null : <Marker position={position} />;
}

interface StaticLocationPickerProps {
  center: [number, number];
  zoom?: number;
  markerPosition?: [number, number];
  className?: string;
}

export function StaticLocationMap({ center, zoom = 15, markerPosition, className }: StaticLocationPickerProps) {
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

export function LocationPicker({ onLocationSelect, initialPosition, interactive = true }: LocationPickerProps) {
  // Dakar, Senegal coordinates
  const defaultCenter: [number, number] = [14.6937, -17.4441];

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
          <LocationMarker onLocationSelect={onLocationSelect} interactive={interactive} />
        </MapContainer>
      </div>
      {interactive && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Cliquez sur la carte pour indiquer votre position exacte
        </p>
      )}
    </div>
  );
}
