import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Camera, MapPin, Upload, X, Loader2 } from 'lucide-react';
import { db, storage } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { analyzeImageWithVision, predictFeasibilityAndImpact, reverseGeocode } from '../services/googleCloud';
import toast from 'react-hot-toast';

const Report = () => {
  const { user } = useAuth();
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [reportType, setReportType] = useState('vacant_land');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const fileInputRef = useRef(null);

  const reportTypes = [
    { value: 'vacant_land', label: 'Unused/Vacant Land', icon: '🏚️' },
    { value: 'tree_loss', label: 'Tree Loss Area', icon: '🌳' },
    { value: 'heat_hotspot', label: 'Heat-Prone Hotspot', icon: '🔥' }
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          
          // Get address from coordinates
          const addr = await reverseGeocode(latitude, longitude);
          setAddress(addr || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
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
      // Analyze image automatically
      analyzeImage(file);
    }
  };

  const analyzeImage = async (imageFile) => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeImageWithVision(imageFile);
      setAnalysis(result);
      toast.success('Image analyzed successfully!');
    } catch (error) {
      toast.error('Error analyzing image');
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

    if (!image || !location) {
      toast.error('Please capture an image and location');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `reports/${user.uid}/${Date.now()}_${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);

      // Get feasibility prediction
      const feasibilityData = await predictFeasibilityAndImpact(location, analysis);

      // Save report to Firestore
      const reportData = {
        userId: user.uid,
        userEmail: user.email,
        type: reportType,
        description,
        location,
        address,
        imageUrl,
        imageAnalysis: analysis,
        feasibility: feasibilityData,
        status: 'pending',
        upvotes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'reports'), reportData);
      
      toast.success('Report submitted successfully!');
      
      // Reset form
      setImage(null);
      setLocation(null);
      setAddress('');
      setDescription('');
      setAnalysis(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
    } catch (error) {
      toast.error('Error submitting report');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Report Greening Opportunity</h1>
          <p className="text-gray-600 mb-8">Help identify areas that need greening in your community</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {reportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setReportType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      reportType === type.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{type.icon}</div>
                    <div className="text-sm font-medium">{type.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Image Capture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Capture Photo
              </label>
              <div className="flex items-center space-x-4">
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
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 cursor-pointer transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  <span>Capture Photo</span>
                </label>
                {image && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{image.name}</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        setAnalysis(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {image && (
                <div className="mt-4">
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Captured"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Location Capture */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Location
              </label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Get Current Location</span>
                </button>
                {location && (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Address will appear here..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe the area and why it needs greening..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* AI Analysis Results */}
            {analysis && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">AI Analysis Results</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Land Type:</span> {analysis.landType.replace('_', ' ')}
                  </div>
                  <div>
                    <span className="font-medium">Vegetation Cover:</span> {(analysis.vegetationCover * 100).toFixed(1)}%
                  </div>
                  <div>
                    <span className="font-medium">Suitability Score:</span> {(analysis.suitabilityScore * 100).toFixed(1)}%
                  </div>
                  <div>
                    <span className="font-medium">Built Area:</span> {(analysis.builtAreaPercentage * 100).toFixed(1)}%
                  </div>
                </div>
                {analysis.recommendations && (
                  <div className="mt-3">
                    <span className="font-medium">Recommendations:</span>
                    <ul className="list-disc list-inside mt-1 text-sm">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !image || !location}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
