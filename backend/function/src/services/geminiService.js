import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyze a reported location for greening feasibility and impact
 */
export async function analyzeLocation(report) {
  const prompt = `
You are an urban sustainability and climate expert.

Analyze this citizen report for greening feasibility and environmental impact.

Report:
${JSON.stringify(report, null, 2)}

Return ONLY JSON:
{
  "feasibility": "High | Medium | Low",
  "coolingImpact": "High | Medium | Low",
  "greenCoverPotential": "High | Medium | Low",
  "priorityScore": 1-10,
  "reasoning": "Short explanation"
}
`;

  const result = await model.generateContent(prompt);
  return safeParse(result.response.text());
}

/**
 * Generate short citizen-friendly summary
 */
export async function generateSummary(report) {
  const prompt = `
Summarize why greening this location is important in 2 short bullet points.

Report:
${JSON.stringify(report, null, 2)}
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Safely parse JSON from Gemini response
 */
function safeParse(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match[0]);
  } catch (err) {
    console.error("Gemini JSON parse failed:", text);
    return { error: "Invalid AI response" };
  }
}
