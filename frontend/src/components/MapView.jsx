// src/components/MapView.jsx
import React, { useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Optionally import leaflet-heatmap if Google Maps API is not used
import { useEffect } from 'react';
// If you want to use Google Maps API, you can integrate it in a separate component or via a backend service.
// For now, we use leaflet-heatmap for demo purposes (install with: npm install leaflet.heat)
import 'leaflet.heat';

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




/**
 * MapView component
 * @param {Array<Object>} reports - Array of report objects. Each should have at least: { id, title, location, status }
 * @param {Array<{lat: number, lng: number, score?: number}>} [predictions] - AI prediction points for greening (heatmap). Use Google Maps API or leaflet-heatmap for visualization.
 * @param {Object} [carbonMetrics] - Optional carbon impact metrics, keyed by report id: { [id]: { carbonAbsorbed: number, sustainability: string } }
 * @param {Array<{type: string, lat: number, lng: number, details?: string}>} [interventions] - Green interventions: type is one of 'pocket-park', 'rooftop-garden', 'urban-farm', 'roadside-plantation'.
 *
 * Note: For Google Maps API integration, replace leaflet-heatmap with a Google Maps heatmap layer, or fetch prediction overlays from a backend using Google APIs.
 */
const MapView = ({ reports = [], predictions = [], carbonMetrics = null, interventions = [] }) => {
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

  // Heatmap overlay for AI-driven greening prediction
  function HeatmapLayer({ points }) {
    const map = useMap();
    useEffect(() => {
      if (!points || points.length === 0) return;
      // Remove previous heatmap if any
      if (map._heatLayer) {
        map.removeLayer(map._heatLayer);
        map._heatLayer = null;
      }
      // Convert points to [lat, lng, intensity]
      const heatData = points.map(p => [p.lat, p.lng, p.score || 0.5]);
      // @ts-ignore
      const heat = L.heatLayer(heatData, { radius: 25, blur: 18, maxZoom: 17 });
      heat.addTo(map);
      map._heatLayer = heat;
      return () => {
        if (map._heatLayer) {
          map.removeLayer(map._heatLayer);
          map._heatLayer = null;
        }
      };
    }, [points, map]);
    return null;
  }

  // Marker icon by intervention type
  const interventionIcons = {
    'pocket-park': L.icon({ ...DefaultIcon.options, iconUrl: icon, className: 'intervention-pocket-park' }),
    'rooftop-garden': L.icon({ ...DefaultIcon.options, iconUrl: icon, className: 'intervention-rooftop-garden' }),
    'urban-farm': L.icon({ ...DefaultIcon.options, iconUrl: icon, className: 'intervention-urban-farm' }),
    'roadside-plantation': L.icon({ ...DefaultIcon.options, iconUrl: icon, className: 'intervention-roadside-plantation' }),
  };

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
        {/* AI-Driven Greening Prediction Heatmap */}
        {predictions && predictions.length > 0 && <HeatmapLayer points={predictions} />}

        {/* Existing Reports */}
        {reports.map((report, idx) => (
          <Marker
            key={report.id}
            position={markerPositions[idx]}
          >
            <Popup>
              <div className="space-y-2">
                <h4 className="font-semibold">{report.title}</h4>
                <p className="text-sm text-gray-600">{report.location}</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${report.status === 'resolved'
                    ? 'bg-green-100 text-green-800'
                    : report.status === 'in-progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                  {report.status.split('-').map(word =>
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
                {/* Carbon Impact Reporting */}
                {carbonMetrics && carbonMetrics[report.id] && (
                  <div className="mt-2 text-xs text-green-700">
                    <strong>Carbon Absorbed:</strong> {carbonMetrics[report.id].carbonAbsorbed} kg CO₂<br />
                    <strong>Sustainability:</strong> {carbonMetrics[report.id].sustainability}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Expanded Green Interventions */}
        {interventions.map((item, idx) => (
          <Marker
            key={`intervention-${idx}`}
            position={[item.lat, item.lng]}
            icon={interventionIcons[item.type] || DefaultIcon}
          >
            <Popup>
              <div className="space-y-1">
                <h4 className="font-semibold">{item.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                {item.details && <p className="text-xs text-gray-700">{item.details}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;