import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, Upload, X, Loader2, Sparkles, Leaf, TreePine, ThermometerSun, Info } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { reportsAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const Report = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null); // { lat, lng }
  const [address, setAddress] = useState('');
  const [reportType, setReportType] = useState('unused_space');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  // Default center for map (if no location yet)
  const [mapCenter, setMapCenter] = useState({ lat: 12.9716, lng: 77.5946 });

  const reportTypes = [
    {
      value: 'unused_space',
      label: 'Vacant Land',
      icon: '🏚️',
      description: 'Empty plot available for greening',
      gradient: 'from-orange-50 to-orange-100',
      border: 'group-hover:border-orange-300'
    },
    {
      value: 'tree_loss',
      label: 'Tree Loss',
      icon: '🌳',
      description: 'Area needing reforestation',
      gradient: 'from-green-50 to-green-100',
      border: 'group-hover:border-green-300'
    },
    {
      value: 'heat_hotspot',
      label: 'Heat Hotspot',
      icon: '🔥',
      description: 'High temperature zone',
      gradient: 'from-red-50 to-red-100',
      border: 'group-hover:border-red-300'
    }
  ];

  // Auto-detect location on load
  useEffect(() => {
    if (navigator.geolocation && !location) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          // Don't auto-set location to avoid accidental selection, just center map
        },
        (error) => console.log('Location access denied or error')
      );
    }
  }, []);

  const handleMapClick = (e) => {
    if (e.detail.latLng) {
      const newLoc = { lat: e.detail.latLng.lat, lng: e.detail.latLng.lng };
      setLocation(newLoc);
      setAddress(`${newLoc.lat.toFixed(5)}, ${newLoc.lng.toFixed(5)}`);
      // Optionally reverse geocode here if API enabled
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Optional: Auto-analyze implementation could go here
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to submit a report');
      navigate('/auth');
      return;
    }

    if (!location || !description) {
      toast.error('Please provide location and description');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      if (image) {
        // Mock upload
        imageUrl = 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2613&auto=format&fit=crop';
      }

      const reportData = {
        title: `${reportType.replace('_', ' ').toUpperCase()}`,
        description,
        location: { ...location, address },
        reportType,
        imageUrl,
        additionalInfo: analysis ? JSON.stringify(analysis) : ''
      };

      const response = await reportsAPI.create(reportData);

      // Trigger Post-Submission Analysis
      if (imageUrl) {
        try {
          aiAPI.analyze({
            reportId: response.id,
            imageUrl,
            reportType,
            location: { ...location, address },
            description
          });
        } catch (e) { console.error("Async analysis trigger failed", e); }
      }

      toast.success('Report submitted successfully!');
      navigate('/dashboard');

    } catch (error) {
      toast.error(error.message || 'Error submitting report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Hero Header */}
      <div className="bg-white border-b sticky top-0 z-30 shadow-sm glass-header">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">New Report</h1>
              <p className="text-xs text-gray-500">Submit a greening opportunity</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>Cancel</Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Form Inputs */}
          <div className="lg:col-span-7 space-y-6">

            {/* Type Selection */}
            <section>
              <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">What are you reporting?</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReportType(type.value)}
                    className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 group ${reportType === type.value
                        ? 'border-green-500 bg-green-50 shadow-md transform scale-[1.02]'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                  >
                    <span className="text-2xl mb-2 block">{type.icon}</span>
                    <h3 className="font-semibold text-gray-900 text-sm">{type.label}</h3>
                    <p className="text-xs text-gray-500 mt-1 leading-tight">{type.description}</p>

                    {reportType === type.value && (
                      <div className="absolute top-2 right-2 text-green-500">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg ring-4 ring-green-100" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            {/* Photo Upload */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4 text-gray-500" />
                Evidence Photo
              </h2>

              <div className="relative group">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageCapture}
                  className="hidden"
                  id="photo-upload"
                />

                {!image ? (
                  <label
                    htmlFor="photo-upload"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-green-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Click to upload or capture</span>
                    <span className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</span>
                  </label>
                ) : (
                  <div className="relative h-64 rounded-xl overflow-hidden shadow-inner group-hover:shadow-md transition-shadow">
                    <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage(null)}
                      className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur rounded-full shadow-sm hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 flex items-center gap-1.5 shadow-sm">
                      <Sparkles className="w-3 h-3" />
                      Ready for AI Analysis
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-500" />
                Details
              </h2>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all resize-none text-sm"
                placeholder="Describe the area conditions, estimated size, and potential benefits of greening..."
              />
            </section>
          </div>

          {/* Right Column: Map */}
          <div className="lg:col-span-5 h-fit sticky top-24">
            <div className="bg-white p-1 rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  Pin Location
                </h2>
                <span className="text-xs text-xs text-gray-500 bg-white px-2 py-1 rounded border">
                  {location ? 'Location Selected' : 'Tap on map'}
                </span>
              </div>

              <div className="h-[400px] w-full relative bg-gray-100">
                {GOOGLE_MAPS_API_KEY ? (
                  <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                    <Map
                      defaultCenter={mapCenter}
                      defaultZoom={15}
                      mapId="REPORT_MAP_ID"
                      onClick={handleMapClick}
                      disableDefaultUI={true}
                      gestureHandling={'greedy'}
                      className="w-full h-full"
                    >
                      {location && (
                        <AdvancedMarker position={location}>
                          <Pin background={'#ef4444'} glyphColor={'#fff'} borderColor={'#b91c1c'} />
                        </AdvancedMarker>
                      )}
                    </Map>
                  </APIProvider>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                    <MapPin className="w-8 h-8 text-gray-300 mb-2" />
                    <p className="text-sm text-gray-500">Map unavailable</p>
                    <p className="text-xs text-gray-400">Add API Key to enable location picking</p>
                  </div>
                )}

                {/* Address Display Overlay */}
                {location && (
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-200/50">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Selected Coordinates</p>
                    <p className="text-sm font-mono text-gray-800 truncate">
                      {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="submit"
                variant="gradient" // Use your gradient variant
                className="w-full py-4 text-base font-semibold shadow-xl shadow-green-500/20 hover:shadow-green-500/30 transform hover:-translate-y-0.5 transition-all"
                isLoading={isSubmitting}
                disabled={!location}
              >
                {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
              </Button>
              <p className="text-center text-xs text-gray-400 mt-3">
                By submitting, you agree to our community guidelines.
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Report;
