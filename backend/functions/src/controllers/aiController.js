const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ImageAnnotatorClient } = require("@google-cloud/vision");

// Initialize services
const db = admin.firestore();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const visionClient = new ImageAnnotatorClient();

// Analyze report with AI
exports.analyzeReport = onRequest({
  cors: true,
  region: "us-central1",
}, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user has expert role
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || !['expert', 'authority'].includes(userDoc.data().role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { reportId, imageUrl, reportType, location, description } = req.body;

    if (!reportId || !reportType || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    let imageAnalysis = null;
    let feasibilityScore = 0;
    let impactScore = 0;
    let recommendations = [];

    // Analyze image if provided
    if (imageUrl) {
      try {
        const [result] = await visionClient.annotateImage({
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
            { type: 'LANDMARK_DETECTION', maxResults: 5 }
          ]
        });

        imageAnalysis = {
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
      } catch (imageError) {
        logger.warn('Image analysis failed:', imageError);
        imageAnalysis = { error: 'Image analysis failed' };
      }
    }

    // Get AI analysis using Gemini
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
As an urban planning and environmental expert, analyze this greening proposal:

Report Type: ${reportType}
Location: ${location.address || `${location.lat}, ${location.lng}`}
Description: ${description}

${imageAnalysis ? `
Image Analysis Results:
- Labels detected: ${imageAnalysis.labels.map(l => l.description).join(', ')}
- Objects detected: ${imageAnalysis.objects.map(o => o.name).join(', ')}
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

      // Parse JSON response
      const aiAnalysis = JSON.parse(text);
      
      feasibilityScore = aiAnalysis.feasibilityScore || 0;
      impactScore = aiAnalysis.impactScore || 0;
      recommendations = aiAnalysis.recommendations || [];

      // Save analysis to Firestore
      const analysisData = {
        reportId,
        imageAnalysis,
        aiAnalysis,
        feasibilityScore,
        impactScore,
        recommendations,
        analyzedBy: decodedToken.uid,
        analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
        status: 'completed'
      };

      await db.collection('reports')
        .doc(reportId)
        .collection('analysis')
        .add(analysisData);

      // Update report with analysis summary
      await db.collection('reports').doc(reportId).update({
        aiAnalysis: {
          feasibilityScore,
          impactScore,
          recommendations: recommendations.slice(0, 3), // Top 3 recommendations
          analyzedAt: admin.firestore.FieldValue.serverTimestamp()
        }
      });

      res.status(200).json({
        success: true,
        analysis: analysisData
      });

    } catch (aiError) {
      logger.error('AI analysis failed:', aiError);
      
      // Fallback analysis
      const fallbackAnalysis = {
        feasibilityScore: calculateFallbackFeasibility(reportType, imageAnalysis),
        impactScore: calculateFallbackImpact(reportType, imageAnalysis),
        recommendations: getFallbackRecommendations(reportType),
        error: 'AI analysis failed, using fallback analysis'
      };

      await db.collection('reports')
        .doc(reportId)
        .collection('analysis')
        .add({
          ...fallbackAnalysis,
          reportId,
          analyzedBy: decodedToken.uid,
          analyzedAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'fallback'
        });

      res.status(200).json({
        success: true,
        analysis: fallbackAnalysis
      });
    }

  } catch (error) {
    logger.error('Error in analyzeReport:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analysis for a report
exports.getReportAnalysis = onRequest({
  cors: true,
  region: "us-central1",
}, async (req, res) => {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    await admin.auth().verifyIdToken(token);

    const { reportId } = req.params;
    if (!reportId) {
      return res.status(400).json({ error: 'Report ID is required' });
    }

    const analysisSnapshot = await db.collection('reports')
      .doc(reportId)
      .collection('analysis')
      .orderBy('analyzedAt', 'desc')
      .limit(1)
      .get();

    if (analysisSnapshot.empty) {
      return res.status(404).json({ error: 'No analysis found for this report' });
    }

    const analysis = analysisSnapshot.docs[0].data();
    analysis.id = analysisSnapshot.docs[0].id;

    res.status(200).json(analysis);

  } catch (error) {
    logger.error('Error getting report analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Batch analyze multiple reports (for experts)
exports.batchAnalyzeReports = onRequest({
  cors: true,
  region: "us-central1",
}, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Check if user has expert role
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || !['expert', 'authority'].includes(userDoc.data().role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const { reportIds } = req.body;

    if (!reportIds || !Array.isArray(reportIds)) {
      return res.status(400).json({ error: 'Report IDs array is required' });
    }

    if (reportIds.length > 10) {
      return res.status(400).json({ error: 'Cannot analyze more than 10 reports at once' });
    }

    const results = [];
    
    for (const reportId of reportIds) {
      try {
        const reportDoc = await db.collection('reports').doc(reportId).get();
        if (!reportDoc.exists) {
          results.push({ reportId, error: 'Report not found' });
          continue;
        }

        const reportData = reportDoc.data();
        
        // Trigger analysis for each report
        // In a real implementation, you might use a queue system
        const analysisResult = await triggerSingleAnalysis(reportId, reportData, decodedToken.uid);
        results.push({ reportId, success: true, analysis: analysisResult });
        
      } catch (error) {
        logger.error(`Error analyzing report ${reportId}:`, error);
        results.push({ reportId, error: error.message });
      }
    }

    res.status(200).json({
      message: 'Batch analysis completed',
      results
    });

  } catch (error) {
    logger.error('Error in batchAnalyzeReports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper functions
function calculateFallbackFeasibility(reportType, imageAnalysis) {
  const baseScore = {
    'unused_space': 80,
    'tree_loss': 70,
    'heat_hotspot': 75
  };
  
  let score = baseScore[reportType] || 50;
  
  if (imageAnalysis && imageAnalysis.labels) {
    const positiveLabels = ['vegetation', 'tree', 'grass', 'park', 'garden'];
    const negativeLabels = ['building', 'road', 'concrete', 'parking'];
    
    const hasPositive = imageAnalysis.labels.some(label => 
      positiveLabels.includes(label.description.toLowerCase())
    );
    const hasNegative = imageAnalysis.labels.some(label => 
      negativeLabels.includes(label.description.toLowerCase())
    );
    
    if (hasPositive) score += 10;
    if (hasNegative) score -= 20;
  }
  
  return Math.max(0, Math.min(100, score));
}

function calculateFallbackImpact(reportType, imageAnalysis) {
  const baseScore = {
    'unused_space': 85,
    'tree_loss': 90,
    'heat_hotspot': 95
  };
  
  return baseScore[reportType] || 60;
}

function getFallbackRecommendations(reportType) {
  const recommendations = {
    'unused_space': [
      'Plant native trees and shrubs suitable for local climate',
      'Create a community garden with edible plants',
      'Install rainwater harvesting system for irrigation',
      'Add seating areas for community engagement'
    ],
    'tree_loss': [
      'Replant native tree species in the same location',
      'Implement tree protection measures for remaining trees',
      'Create a small memorial garden',
      'Establish a tree care volunteer program'
    ],
    'heat_hotspot': [
      'Install shade structures and canopies',
      'Plant heat-tolerant tree species',
      'Create cool pavement surfaces',
      'Add water features like fountains or misters'
    ]
  };
  
  return recommendations[reportType] || [
    'Conduct site assessment with local experts',
    'Engage community in planning process',
    'Develop phased implementation plan',
    'Secure funding and permits'
  ];
}

async function triggerSingleAnalysis(reportId, reportData, expertId) {
  // This would trigger the same analysis as the single report function
  // For now, return a placeholder
  return {
    feasibilityScore: calculateFallbackFeasibility(reportData.reportType, null),
    impactScore: calculateFallbackImpact(reportData.reportType, null),
    recommendations: getFallbackRecommendations(reportData.reportType),
    status: 'queued'
  };
}
