import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, LayerGroup, LayersControl } from 'react-leaflet';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  TreePine,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Users
} from 'lucide-react';

// Fix for default markers in react-leaflet
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapVisualization = () => {
  const [reports, setReports] = useState([]);
  const [heatZones, setHeatZones] = useState([]);
  const [greenZones, setGreenZones] = useState([]);
  const [selectedLayer, setSelectedLayer] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch real-time reports from Firestore
    const q = query(
      collection(db, 'reports'),
      orderBy('createdAt', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const reportsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReports(reportsData);

      // Calculate Heat Zones from 'heat_hotspot' reports
      const newHeatZones = reportsData
        .filter(r => r.reportType === 'heat_hotspot')
        .map(r => ({
          id: r.id,
          lat: r.location.lat,
          lng: r.location.lng,
          intensity: 0.8, // Default intensity
          radius: 300 // Default radius
        }));
      setHeatZones(newHeatZones);

      // Calculate Green Zones from completed/implemented projects
      // assuming they contribute to green cover
      const newGreenZones = reportsData
        .filter(r => r.status === 'implemented' || r.status === 'completed')
        .map(r => ({
          id: r.id,
          lat: r.location.lat,
          lng: r.location.lng,
          coverage: 0.7, // Default coverage
          radius: 200 // Default radius
        }));
      setGreenZones(newGreenZones);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getReportIcon = (type) => {
    const iconConfig = {
      vacant_land: { color: 'text-orange-600', icon: '🏚️' },
      tree_loss: { color: 'text-red-600', icon: '🌳' },
      heat_hotspot: { color: 'text-red-700', icon: '🔥' }
    };

    const config = iconConfig[type] || iconConfig.vacant_land;

    return divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-300">
        <span class="text-lg">${config.icon}</span>
      </div>`,
      className: 'custom-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  const getHeatColor = (intensity) => {
    if (intensity > 0.8) return '#dc2626';
    if (intensity > 0.6) return '#f97316';
    if (intensity > 0.4) return '#fbbf24';
    return '#fde047';
  };

  const getGreenColor = (coverage) => {
    if (coverage > 0.7) return '#15803d';
    if (coverage > 0.5) return '#16a34a';
    if (coverage > 0.3) return '#22c55e';
    return '#4ade80';
  };

  const filteredReports = reports.filter(report => {
    if (selectedLayer === 'all') return true;
    return report.type === selectedLayer;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">GreenPulse Map Visualization</h1>
          <p className="text-gray-600">Interactive map showing heat zones, green areas, and citizen reports</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={selectedLayer}
                onChange={(e) => setSelectedLayer(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Reports</option>
                <option value="vacant_land">Vacant Land</option>
                <option value="tree_loss">Tree Loss</option>
                <option value="heat_hotspot">Heat Hotspots</option>
              </select>
            </div>

            {/* Legend */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Heat Zones</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Green Zones</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-lg">🏚️</span>
                <span>Reports</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <MapContainer
          center={[40.7128, -74.0060]}
          zoom={12}
          style={{ height: 'calc(100vh - 200px)', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Heat Zones Layer */}
          <LayerGroup>
            {heatZones.map((zone) => (
              <CircleMarker
                key={`heat-${zone.id}`}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: getHeatColor(zone.intensity),
                  fillColor: getHeatColor(zone.intensity),
                  fillOpacity: 0.3,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-semibold text-red-700">Heat Zone</h3>
                    <p>Intensity: {(zone.intensity * 100).toFixed(0)}%</p>
                    <p>Radius: {zone.radius}m</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </LayerGroup>

          {/* Green Zones Layer */}
          <LayerGroup>
            {greenZones.map((zone) => (
              <CircleMarker
                key={`green-${zone.id}`}
                center={[zone.lat, zone.lng]}
                radius={zone.radius}
                pathOptions={{
                  color: getGreenColor(zone.coverage),
                  fillColor: getGreenColor(zone.coverage),
                  fillOpacity: 0.3,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-semibold text-green-700">Green Zone</h3>
                    <p>Coverage: {(zone.coverage * 100).toFixed(0)}%</p>
                    <p>Radius: {zone.radius}m</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </LayerGroup>

          {/* Reports Layer */}
          <LayerGroup>
            {filteredReports.map((report) => (
              <Marker
                key={report.id}
                position={[report.location.lat, report.location.lng]}
                icon={getReportIcon(report.type)}
              >
                <Popup>
                  <div className="text-sm max-w-xs">
                    <h3 className="font-semibold capitalize">
                      {report.type.replace('_', ' ')}
                    </h3>
                    <p className="text-gray-600 mt-1">{report.description}</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-gray-500">
                        <strong>Address:</strong> {report.address}
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Status:</strong>
                        <span className={`ml-1 px-2 py-1 rounded text-xs ${report.status === 'approved' ? 'bg-green-100 text-green-800' :
                            report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                          }`}>
                          {report.status}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        <strong>Upvotes:</strong> {report.upvotes || 0}
                      </p>
                      {report.feasibility && (
                        <p className="text-xs text-gray-500">
                          <strong>Feasibility:</strong> {report.feasibility.feasibilityScore}%
                        </p>
                      )}
                    </div>
                    {report.imageUrl && (
                      <img
                        src={report.imageUrl}
                        alt="Report"
                        className="mt-2 w-full h-32 object-cover rounded"
                      />
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </MapContainer>
      </div>

      {/* Stats Panel */}
      <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h3 className="font-semibold text-gray-800 mb-3">Map Statistics</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>Total Reports</span>
            </span>
            <span className="font-medium">{reports.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Thermometer className="w-4 h-4 text-red-500" />
              <span>Heat Zones</span>
            </span>
            <span className="font-medium">{heatZones.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <TreePine className="w-4 h-4 text-green-500" />
              <span>Green Zones</span>
            </span>
            <span className="font-medium">{greenZones.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <CheckCircle className="w-4 h-4 text-blue-500" />
              <span>Approved Projects</span>
            </span>
            <span className="font-medium">
              {reports.filter(r => r.status === 'approved').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapVisualization;
