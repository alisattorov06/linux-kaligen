import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';

// Initialize Gemini Client
// IMPORTANT: Expects process.env.API_KEY to be available
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found inside environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const streamGeminiResponse = async (
  prompt: string,
  onChunk: (text: string) => void
) => {
  const client = getClient();
  
  if (!client) {
    onChunk("XATOLIK: API kaliti topilmadi. .env faylini tekshiring yoki API_KEY ni sozlang.");
    return;
  }

  try {
    const model = client.models;
    
    // We create a chat session implies state, but for simple command/response prompt might be better
    // However, user wants context. Let's use generateContentStream with system instruction logic handled manually or via config if supported.
    // Gemini 1.5+ supports systemInstruction in config.
    
    const responseStream = await model.generateContentStream({
      model: 'gemini-3-flash-preview', // Using the recommended fast model
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.7, // Creative but technical
      }
    });

    for await (const chunk of responseStream) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (error: any) {
    console.error("Gemini Error:", error);
    onChunk(`\n[TIZIM XATOSI]: AI javob bera olmadi. ${error.message || 'Noma\'lum xato'}`);
  }
};