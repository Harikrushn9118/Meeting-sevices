const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../config/env.config');

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

class AIService {
  static async analyzeTranscript(transcript) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `
    Analyze the following meeting transcript. Generate a summary, actionItems, decisions, and followUpSuggestions.
    CRITICAL: You MUST include citations for everything. The citation must be an object with a "timestamp" field matching the transcript.
    Return ONLY valid JSON matching this structure:
    {
      "summary": [{ "text": "...", "citations": [{ "timestamp": "..." }] }],
      "actionItems": [{ "task": "...", "assignee": "...", "citations": [{ "timestamp": "..." }] }],
      "decisions": [{ "text": "...", "citations": [{ "timestamp": "..." }] }],
      "followUpSuggestions": [{ "text": "...", "citations": [{ "timestamp": "..." }] }]
    }
    Transcript: ${JSON.stringify(transcript)}
    `;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }
}

module.exports = AIService;
