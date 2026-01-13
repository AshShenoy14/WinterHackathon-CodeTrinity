import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
} else {
    console.warn("VITE_GEMINI_API_KEY is missing in .env file. AI features will be simulated.");
}

export const analyzeImageWithGemini = async (imageBase64, mimeType = "image/jpeg", reportType = "general") => {
    if (!genAI) {
        throw new Error("Gemini API Key missing");
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
        You are acting as a "Cloud Vision API" agent for the GreenPulse app.
        The user reported this image as: ${reportType}.
        
        CRITICAL: DETERMINE RELEVANCE FIRST.
        If the image is:
        - Indoor environment (room, office, home)
        - A screenshot, meme, or computer generated text
        - A selfie or portrait of a person
        - Completely blurry or dark
        - Only a single object like a keyboard, mouse, cup, etc.
        ...then it is IRRELEVANT. Return "isRelevant": false.

        Only if it is a VALID outdoor, nature, city street, or environmental scene:
        - Analyze for greening potential (planting trees, cleaning waste, etc.)
        - Set "isRelevant": true.

        Return STRICT JSON:
        {
            "isRelevant": boolean,
            "spamReason": "string (Why it is rejected, e.g. 'Indoor/Office image detected')",
            "visionTags": ["list", "of", "detected", "objects"],
            "riskLevel": "Low" | "Medium" | "High",
            "confidence": number (0-1),
            "recommendation": "Native plant suggestions or action items (Max 15 words)",
            "environmentalImpact": "Short description of impact",
            "nativeSpecies": ["List", "of", "3", "species"],
            "typeConfirmed": boolean
        }
        Only return the JSON.
        `;

        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1] || imageBase64, // Remove header if present
                mimeType
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        // Clean markdown code blocks if present
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        throw error;
    }
};
