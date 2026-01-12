const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ImageAnnotatorClient } = require("@google-cloud/vision");
const logger = require("firebase-functions/logger");

// Initialize services
// Note: In a real production env, ensure GOOGLE_APPLICATION_CREDENTIALS is set for Vision API
// and GEMINI_API_KEY is available.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_API_KEY_HERE");
const visionClient = new ImageAnnotatorClient();

/**
 * Analyzes an image using Google Cloud Vision API
 * @param {string} imageUrl 
 * @returns {Promise<Object>} Analysis results
 */
exports.analyzeImage = async (imageUrl) => {
    if (!imageUrl) return null;

    try {
        const [result] = await visionClient.annotateImage({
            image: { source: { imageUri: imageUrl } },
            features: [
                { type: 'LABEL_DETECTION', maxResults: 10 },
                { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
                { type: 'LANDMARK_DETECTION', maxResults: 5 }
            ]
        });

        return {
            labels: result.labelAnnotations?.map(label => ({
                description: label.description,
                score: label.score
            })) || [],
            objects: result.localizedObjectAnnotations?.map(obj => ({
                name: obj.name,
                score: obj.score,
                boundingBox: obj.boundingPoly
            })) || [],
            landmarks: result.landmarkAnnotations?.map(landmark => ({
                description: landmark.description,
                score: landmark.score,
                locations: landmark.locations
            })) || []
        };
    } catch (error) {
        logger.warn('Image analysis failed:', error);
        // Return null or partial error object, but don't crash
        return { error: 'Image analysis failed' };
    }
};

/**
 * Generates an analysis of the greening proposal using Gemini
 * @param {Object} data - The report data
 * @param {string} data.reportType - Type of report
 * @param {Object} data.location - Location object
 * @param {string} data.description - User description
 * @param {Object} [data.imageAnalysis] - Optional vision API results
 * @returns {Promise<Object>} Gemini analysis result
 */
exports.generateReportAnalysis = async (data) => {
    const { reportType, location, description, imageAnalysis } = data;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
As an urban planning and environmental expert, analyze this greening proposal:

Report Type: ${reportType}
Location: ${location.address || `${location.lat}, ${location.lng}`}
Description: ${description}

${imageAnalysis ? `
Image Analysis Results:
- Labels detected: ${imageAnalysis.labels?.map(l => l.description).join(', ') || 'None'}
- Objects detected: ${imageAnalysis.objects?.map(o => o.name).join(', ') || 'None'}
` : ''}

Please provide:
1. Feasibility score (0-100) for implementing greening at this location
2. Environmental impact score (0-100) 
3. Specific recommendations for implementation
4. Potential challenges and solutions
5. Estimated timeline and cost considerations

Respond in JSON format with this structure:
{
  "feasibilityScore": number,
  "impactScore": number,
  "recommendations": ["string"],
  "challenges": ["string"],
  "solutions": ["string"],
  "estimatedTimeline": "string",
  "costConsiderations": "string",
  "detailedAnalysis": "string"
}
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean up potential markdown code blocks if Gemini returns them
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        logger.error('Gemini analysis failed:', error);
        // Return fallback logic
        return {
            feasibilityScore: 50,
            impactScore: 50,
            recommendations: ["Conduct manual site assessment"],
            error: 'AI analysis failed, using fallback'
        };
    }
};
