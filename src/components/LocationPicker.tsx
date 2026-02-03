import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

type LatLng = { lat: number; lng: number };

interface LocationPickerProps {
  onLocationSelect: (location: LatLng | null) => void;
  initialPosition?: LatLng | null;
  interactive?: boolean;
}

function safeDestroyMap(container: HTMLDivElement | null, map: L.Map | null) {
  try {
    map?.off();
    map?.remove();
  } catch {
    // ignore
  }

  // React 18 StrictMode can mount/unmount twice; ensure container can be re-used safely.
  if (container) {
    (container as any)._leaflet_id = undefined;
    container.innerHTML = '';
  }
}

function ensureMarker(map: L.Map, markerRef: React.MutableRefObject<L.Marker | null>, latlng: L.LatLngExpression) {
  if (!markerRef.current) {
    markerRef.current = L.marker(latlng).addTo(map);
  } else {
    markerRef.current.setLatLng(latlng);
  }
}

export function LocationPicker({ onLocationSelect, initialPosition = null, interactive = true }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onSelectRef = useRef(onLocationSelect);

  // Keep latest callback without re-creating the map
  useEffect(() => {
    onSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dakar, Senegal coordinates
    const defaultCenter: [number, number] = [14.6937, -17.4441];
    const map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView(defaultCenter, 12);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const setLocation = (latlng: L.LatLngExpression) => {
      ensureMarker(map, markerRef, latlng);
      const ll = L.latLng(latlng);
      onSelectRef.current({ lat: ll.lat, lng: ll.lng });
    };

    if (initialPosition) {
      setLocation([initialPosition.lat, initialPosition.lng]);
      map.setView([initialPosition.lat, initialPosition.lng], 15);
    }

    if (interactive) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        setLocation(e.latlng);
      });

      map.on('locationfound', (e: L.LocationEvent) => {
        setLocation(e.latlng);
        map.setView(e.latlng, 15);
      });

      map.on('locationerror', () => {
        // Geolocation blocked/unavailable; user can still click to set location.
      });

      // Try to locate user on mount; failure is handled silently.
      try {
        map.locate({ setView: false, maxZoom: 15 });
      } catch {
        // ignore
      }
    }

    return () => {
      safeDestroyMap(container, map);
      mapRef.current = null;
      markerRef.current = null;
    };
    // Recreate map only if these change
  }, [interactive, initialPosition?.lat, initialPosition?.lng]);

  return (
    <div>
      <div className="h-64 rounded-xl overflow-hidden border">
        <div ref={containerRef} className="h-full w-full" />
      </div>
      {interactive && (
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Cliquez sur la carte pour indiquer votre position exacte
        </p>
      )}
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const map = L.map(container, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    }).setView(center, zoom);

    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (markerPosition) {
      ensureMarker(map, markerRef, markerPosition);
    }

    return () => {
      safeDestroyMap(container, map);
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [center[0], center[1], zoom, markerPosition?.[0], markerPosition?.[1]]);

  return (
    <div className={`h-64 rounded-xl overflow-hidden border ${className || ''}`}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
