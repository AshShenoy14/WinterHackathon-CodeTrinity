import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, Upload, X, Loader2, Sparkles, Leaf, TreePine, ThermometerSun } from 'lucide-react';
import { reportsAPI, aiAPI } from '../services/api';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Report = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [reportType, setReportType] = useState('unused_space');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const reportTypes = [
    { 
      value: 'unused_space', 
      label: 'Unused/Vacant Land', 
      icon: '🏚️',
      description: 'Empty spaces that could be transformed',
      color: 'warning'
    },
    { 
      value: 'tree_loss', 
      label: 'Tree Loss Area', 
      icon: '🌳',
      description: 'Areas where trees have been removed',
      color: 'error'
    },
    { 
      value: 'heat_hotspot', 
      label: 'Heat-Prone Hotspot', 
      icon: '🔥',
      description: 'Areas experiencing high temperatures',
      color: 'danger'
    }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          toast.success('Location captured successfully!');
        },
        (error) => {
          toast.error('Error getting location. Please enable location services.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const analyzeReport = async () => {
    if (!location || !description) {
      toast.error('Please provide location and description first');
      return;
    }

    setIsAnalyzing(true);
    try {
      const imageUrl = image ? URL.createObjectURL(image) : '';
      const result = await aiAPI.analyze({
        reportId: 'temp', // Will be replaced by actual report ID
        imageUrl,
        reportType,
        location: { ...location, address },
        description
      });
      
      setAnalysis(result.analysis);
      toast.success('AI analysis completed!');
    } catch (error) {
      toast.error('Error analyzing report');
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to submit a report');
      return;
    }

    if (!location || !description) {
      toast.error('Please provide location and description');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = '';
      
      // Upload image if provided
      if (image) {
        // In a real implementation, you'd upload to Firebase Storage
        // For now, we'll use a placeholder
        imageUrl = 'https://via.placeholder.com/400x300';
      }

      // Create report
      const reportData = {
        title: `${reportType.replace('_', ' ').toUpperCase()} - ${address}`,
        description,
        location: { ...location, address },
        reportType,
        imageUrl,
        additionalInfo: analysis ? JSON.stringify(analysis) : ''
      };

      const response = await reportsAPI.create(reportData);
      
      // If analysis was requested, trigger it with the actual report ID
      if (analysis) {
        try {
          await aiAPI.analyze({
            reportId: response.id,
            imageUrl,
            reportType,
            location: { ...location, address },
            description
          });
        } catch (analysisError) {
          console.error('Analysis failed:', analysisError);
        }
      }
      
      toast.success('Report submitted successfully!');
      navigate('/dashboard');
      
    } catch (error) {
      toast.error(error.message || 'Error submitting report');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-secondary-200/60 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Report Greening Opportunity
              </h1>
              <p className="text-secondary-600 mt-1">Help identify areas that need greening in your community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Report Type Selection */}
          <Card hover={true} animated={true} className="overflow-hidden">
            <div className="p-6 border-b border-secondary-200/60">
              <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-primary-600" />
                Select Report Type
              </h2>
              <p className="text-sm text-secondary-600 mt-1">Choose the type of greening opportunity you want to report</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReportType(type.value)}
                    className={`relative p-6 rounded-2xl border-2 transition-all duration-300 group ${
                      reportType === type.value
                        ? 'border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 shadow-lg scale-105'
                        : 'border-secondary-200 bg-white hover:border-primary-300 hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{type.icon}</div>
                    <div className="text-sm font-semibold text-secondary-900 mb-1">{type.label}</div>
                    <div className="text-xs text-secondary-600">{type.description}</div>
                    {reportType === type.value && (
                      <div className="absolute -top-2 -right-2">
                        <Badge variant="success" size="sm" dot pulse>
                          Selected
                        </Badge>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Image Capture */}
          <Card hover={true} animated={true} className="overflow-hidden">
            <div className="p-6 border-b border-secondary-200/60">
              <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                <Camera className="w-5 h-5 mr-2 text-primary-600" />
                Capture Photo
              </h2>
              <p className="text-sm text-secondary-600 mt-1">Take a photo of the area that needs greening</p>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                  id="image-input"
                />
                <label
                  htmlFor="image-input"
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-300 shadow-button hover:shadow-button-hover cursor-pointer group"
                >
                  <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Capture Photo</span>
                </label>
                {image && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-secondary-600 font-medium">{image.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setImage(null);
                        setAnalysis(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      icon={X}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
              
              {image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Captured"
                    className="w-full h-64 object-cover rounded-2xl shadow-lg"
                  />
                  {isAnalyzing && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                      <LoadingSpinner size="lg" color="white" text="Analyzing image..." />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Location Capture */}
          <Card hover={true} animated={true} className="overflow-hidden">
            <div className="p-6 border-b border-secondary-200/60">
              <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary-600" />
                Location
              </h2>
              <p className="text-sm text-secondary-600 mt-1">Provide the location of the greening opportunity</p>
            </div>
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  type="button"
                  variant="gradient"
                  onClick={getCurrentLocation}
                  icon={MapPin}
                  disabled={!!location}
                >
                  {location ? 'Location Captured' : 'Get Current Location'}
                </Button>
                {location && (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address will appear here..."
                      className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}
              </div>
              {location && (
                <div className="mt-4 p-4 bg-success-50 border border-success-200 rounded-xl">
                  <p className="text-sm text-success-700">
                    <strong>Location captured:</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card hover={true} animated={true} className="overflow-hidden">
            <div className="p-6 border-b border-secondary-200/60">
              <h2 className="text-xl font-semibold text-secondary-900 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-primary-600" />
                Description
              </h2>
              <p className="text-sm text-secondary-600 mt-1">Describe the area and why it needs greening</p>
            </div>
            <div className="p-6">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Tell us more about this area and why it would benefit from greening..."
                className="w-full px-4 py-3 border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 resize-none"
              />
            </div>
          </Card>

          {/* AI Analysis Results */}
          {analysis && (
            <Card variant="success" hover={true} animated={true} className="overflow-hidden">
              <div className="p-6 border-b border-success-200/60">
                <h2 className="text-xl font-semibold text-success-900 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Analysis Results
                </h2>
                <p className="text-sm text-success-700 mt-1">Our AI has analyzed your image and provided insights</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                      <span className="text-sm font-medium text-secondary-700">Land Type</span>
                      <Badge variant="primary" size="sm">
                        {analysis.landType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                      <span className="text-sm font-medium text-secondary-700">Vegetation Cover</span>
                      <Badge variant="info" size="sm">
                        {(analysis.vegetationCover * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                      <span className="text-sm font-medium text-secondary-700">Built Area</span>
                      <Badge variant="warning" size="sm">
                        {(analysis.builtAreaPercentage * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                      <span className="text-sm font-medium text-secondary-700">Suitability Score</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-secondary-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-success-500 to-success-600 h-2 rounded-full"
                            style={{width: `${analysis.suitabilityScore * 100}%`}}
                          ></div>
                        </div>
                        <Badge variant="success" size="sm">
                          {(analysis.suitabilityScore * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    {analysis.recommendations && (
                      <div className="p-3 bg-white rounded-xl">
                        <p className="text-sm font-medium text-secondary-700 mb-2">Recommendations:</p>
                        <ul className="space-y-1">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="text-xs text-secondary-600 flex items-start">
                              <TreePine className="w-3 h-3 mr-1 mt-0.5 text-success-500 flex-shrink-0" />
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              isLoading={isSubmitting}
              disabled={!image || !location}
              icon={Upload}
              className="px-8 py-4 text-lg"
            >
              {isSubmitting ? 'Submitting Report...' : 'Submit Report'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Report;
