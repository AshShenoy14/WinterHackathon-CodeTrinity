import React, { useState, useEffect } from 'react';
import { reportsAPI } from '../services/api';
import MapView from '../components/MapView';

const MapVisualization = () => {
  const [reports, setReports] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch reports using the API Client
        const response = await reportsAPI.getAll({ limit: 100 });
        const reportsData = response.reports || [];
        setReports(reportsData);

        // Calculate Heat Zones / Predictions data from 'heat_hotspot' reports
        // MapView expects points with { lat, lng, score } for HeatmapLayer
        const heatPoints = reportsData
          .filter(r => r.reportType === 'heat_hotspot')
          .map(r => ({
            lat: r.location.lat,
            lng: r.location.lng,
            score: 5 // Weight for heatmap
          }));
        setPredictions(heatPoints);

      } catch (error) {
        console.error("Failed to load map data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">GreenPulse Map Visualization</h1>
          <p className="text-gray-600">Interactive map showing heat zones and citizen reports</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow relative">
        <MapView
          reports={reports}
          predictions={predictions}
        />
      </div>
    </div>
  );
};

export default MapVisualization;

