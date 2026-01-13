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
        You are an environmental expert analyzing an image for a "Green Protocol" app.
        The user reported this as: ${reportType}.
        
        Analyze the image and return a JSON response with the following fields:
        {
            "riskLevel": "Low" | "Medium" | "High",
            "confidence": number (0-1),
            "recommendation": "Specific native plant suggestions or action items (Max 15 words)",
            "environmentalImpact": "Short description of impact",
            "nativeSpecies": ["List", "of", "3", "species"],
            "typeConfirmed": boolean (does the image match the report type?)
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
