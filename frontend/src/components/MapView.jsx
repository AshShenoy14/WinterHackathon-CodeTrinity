import React, { useState, useEffect, useMemo } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const HeatmapLayer = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (!map || !points || !window.google) return;

    // Convert points to WeightedLocation format
    const heatmapData = points.map(p => ({
      location: new window.google.maps.LatLng(p.lat, p.lng),
      weight: p.score || 1
    }));

    const heatmap = new window.google.maps.visualization.HeatmapLayer({
      data: heatmapData,
      radius: 40,
      opacity: 0.8,
      gradient: [
        'rgba(0, 255, 255, 0)',
        'rgba(0, 255, 255, 1)',
        'rgba(0, 191, 255, 1)',
        'rgba(0, 127, 255, 1)',
        'rgba(0, 63, 255, 1)',
        'rgba(0, 0, 255, 1)',
        'rgba(0, 0, 223, 1)',
        'rgba(0, 0, 191, 1)',
        'rgba(0, 0, 159, 1)',
        'rgba(0, 0, 127, 1)',
        'rgba(63, 0, 91, 1)',
        'rgba(127, 0, 63, 1)',
        'rgba(191, 0, 31, 1)',
        'rgba(255, 0, 0, 1)'
      ]
    });

    heatmap.setMap(map);

    return () => {
      heatmap.setMap(null);
    };
  }, [map, points]);

  return null;
};

const MapView = ({ reports = [], predictions = [], interventions = [] }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  // Default center (Bangalore)
  const defaultCenter = { lat: 12.9716, lng: 77.5946 };

  return (
    <div style={{ height: '500px', width: '100%' }}>
      {/* Check if API Key is present, otherwise show warning */}
      {!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' ? (
        <div className="bg-red-50 p-4 rounded-lg text-center h-full flex flex-col items-center justify-center">
          <h3 className="text-red-800 font-bold text-lg">Google Maps API Key Missing</h3>
          <p className="text-red-600">Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.</p>
        </div>
      ) : (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['visualization', 'marker']}>
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={12}
            mapId="DEMO_MAP_ID"
            gestureHandling={'greedy'}
            disableDefaultUI={false}
          >
            {/* Reports Markers */}
            {reports.map((report) => (
              <AdvancedMarker
                key={report.id}
                position={{
                  lat: report.location?.lat || defaultCenter.lat,
                  lng: report.location?.lng || defaultCenter.lng
                }}
                onClick={() => setSelectedReport(report)}
              >
                <Pin background={
                  report.status === 'resolved' ? '#22c55e' :
                    report.status === 'in_progress' ? '#3b82f6' : '#eab308'
                } borderColor={'#ffffff'} glyphColor={'#ffffff'} scale={1.0} />
              </AdvancedMarker>
            ))}

            {/* Heatmap Overlay */}
            {predictions.length > 0 && <HeatmapLayer points={predictions} />}

            {/* Info Window for Selected Report */}
            {selectedReport && (
              <InfoWindow
                position={{
                  lat: selectedReport.location?.lat || defaultCenter.lat,
                  lng: selectedReport.location?.lng || defaultCenter.lng
                }}
                onCloseClick={() => setSelectedReport(null)}
              >
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-bold text-gray-900 mb-1">{selectedReport.title}</h3>
                  <p className="text-xs text-gray-600 mb-2">{selectedReport.location?.address}</p>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${selectedReport.status === 'resolved' ? 'bg-green-100 text-green-700' :
                        selectedReport.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {selectedReport.status}
                    </span>
                  </div>
                  {/* AI Analysis Visible Badge */}
                  {selectedReport.aiAnalysis && (
                    <div className="bg-indigo-50 border border-indigo-100 p-2 rounded text-[10px] text-indigo-800">
                      <strong className="flex items-center gap-1">
                        ✨ Powered by Gemini
                      </strong>
                      <div className="mt-1">
                        Risk: {selectedReport.aiAnalysis.riskLevel}
                      </div>
                    </div>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      )}
    </div>
  );
};

export default MapView;