import "dotenv/config";
import { analyzeLocation, generateSummary } from "./services/geminiService.js";

async function testGemini() {
  const report = {
    type: "Heat hotspot",
    city: "Bangalore",
    description: "No trees, concrete area, very high temperature"
  };

  const analysis = await analyzeLocation(report);
  console.log("Analysis:", analysis);

  const summary = await generateSummary(report);
  console.log("Summary:", summary);
}

testGemini();