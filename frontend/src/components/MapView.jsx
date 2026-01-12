// src/components/MapView.jsx
import React,{useMemo} from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;




const MapView = ({ reports = [] }) => {
  // Default coordinates (can be set to user's location)
  const defaultCenter = [51.505, -0.09];
  const zoom = 13;

  // Generate stable random offsets for each report (for demo purposes only)
  const markerPositions = useMemo(() => {
    return reports.map((report, idx) => {
      // Use a seeded pseudo-random offset based on report id or index
      // This ensures the same offset for the same report on every render
      const seed = typeof report.id === 'number' ? report.id : idx;
      function seededRandom(s) {
        // Simple LCG
        let x = Math.sin(s + 1) * 10000;
        return x - Math.floor(x);
      }
      const latOffset = seededRandom(seed) * 0.02 - 0.01;
      const lngOffset = seededRandom(seed + 1000) * 0.02 - 0.01;
      return [
        defaultCenter[0] + latOffset,
        defaultCenter[1] + lngOffset
      ];
    });
  }, [reports]);

  return (
    <div className="h-[500px] w-full">
      <MapContainer 
        center={defaultCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {reports.map((report, idx) => (
          <Marker 
            key={report.id} 
            position={markerPositions[idx]}
          >
            <Popup>
              <div className="space-y-2">
                <h4 className="font-semibold">{report.title}</h4>
                <p className="text-sm text-gray-600">{report.location}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  report.status === 'resolved' 
                    ? 'bg-green-100 text-green-800' 
                    : report.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {report.status.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;