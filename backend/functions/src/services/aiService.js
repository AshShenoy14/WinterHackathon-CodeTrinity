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
As an urban planning and environmental expert, analyze this greening proposal based on the data provided.

Report Data:
- Reported Type: ${reportType}
- Location: ${location.address || `${location.lat}, ${location.lng}`}
- User Description: ${description}

Image Vision Analysis (Automatic):
${imageAnalysis ? `
- Labels: ${imageAnalysis.labels?.map(l => l.description).join(', ') || 'None'}
- Objects: ${imageAnalysis.objects?.map(o => o.name).join(', ') || 'None'}
- Landmarks: ${imageAnalysis.landmarks?.map(l => l.description).join(', ') || 'None'}
` : 'No image analysis available.'}

TASK:
1. Verify if the Reported Type matches the visual/description data. If not, suggest the correct category (tree_loss, heat_hotspot, unused_space).
2. Assess "Plantation Feasibility": Is it physically possible to plant trees here? (Consider pavement, space, etc.)
3. Estimate "Land Ownership": Look for cues (fences, park benches, sidewalks) to guess if it's "Public/Government" or "Private".
4. Estimate "Cooling Impact": High/Medium/Low if greened.

OUTPUT JSON FORMAT (Do not include markdown blocks):
{
  "feasibilityScore": number (0-100),
  "plantation_possible": boolean,
  "land_ownership_estimate": "Public" | "Private" | "Unknown",
  "suggested_category": "tree_loss" | "heat_hotspot" | "unused_space",
  "cooling_impact": "High" | "Medium" | "Low",
  "impactScore": number (0-100),
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
        // Fallback logic
        return {
            feasibilityScore: 50,
            plantation_possible: true, // Optimistic fallback
            land_ownership_estimate: "Unknown",
            suggested_category: reportType,
            cooling_impact: "Medium",
            impactScore: 50,
            recommendations: ["Conduct manual site assessment"],
            error: 'AI analysis failed, using fallback'
        };
    }
};
