import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const analyzeImageWithVision = async (imageFile) => {
  try {
    // In a real implementation, this would call Google Cloud Vision API
    // For now, we'll simulate the response
    const mockAnalysis = {
      landType: 'vacant_land',
      vegetationCover: 0.15,
      builtAreaPercentage: 0.05,
      suitabilityScore: 0.85,
      recommendations: ['Plant native trees', 'Create community garden', 'Install rainwater harvesting']
    };
    
    return mockAnalysis;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};

export const predictFeasibilityAndImpact = async (location, landAnalysis) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Analyze the feasibility and environmental impact of a greening project at this location:
    Location: ${location.lat}, ${location.lng}
    Land Analysis: ${JSON.stringify(landAnalysis)}
    
    Provide:
    1. Feasibility score (0-100)
    2. Potential temperature reduction (°C)
    3. Environmental impact score (0-100)
    4. Recommended actions
    5. Estimated cost range
    6. Implementation timeline
    
    Respond in JSON format.
    `;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const analysis = JSON.parse(text);
    return analysis;
  } catch (error) {
    console.error('Error predicting feasibility:', error);
    // Fallback mock response
    return {
      feasibilityScore: 75,
      temperatureReduction: 2.5,
      environmentalImpact: 80,
      recommendedActions: ['Plant native trees', 'Create green space'],
      costRange: '$5,000 - $15,000',
      timeline: '3-6 months'
    };
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return null;
  }
};
