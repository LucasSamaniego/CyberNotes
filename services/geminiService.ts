import { GoogleGenAI } from "@google/genai";
import { AIActionType } from "../types";

// Removed top-level initialization to prevent crash on load if process.env is undefined in browser
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are a high-tech AI assistant integrated into a futuristic "CyberDeck" interface. 
Your responses should be concise, efficient, and helpful. 
When asked to rewrite in "Cyberpunk Style", use slang like "chummer", "nova", "preem", and technological metaphors, but keep the core meaning clear.`;

export const processNoteWithAI = async (content: string, action: AIActionType): Promise<string> => {
  let prompt = "";

  switch (action) {
    case AIActionType.SUMMARIZE:
      prompt = "Summarize the following note content concisely:";
      break;
    case AIActionType.EXPAND:
      prompt = "Expand upon the ideas in this note, adding relevant details and potential action items:";
      break;
    case AIActionType.FIX_GRAMMAR:
      prompt = "Fix any grammar or spelling errors in this note, maintaining the original tone:";
      break;
    case AIActionType.CYBERPUNK_STYLE:
      prompt = "Rewrite the following note content in a gritty, futuristic Cyberpunk 2077-style slang:";
      break;
  }

  try {
    // Initialize client here to ensure environment is ready and catch config errors gracefully
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${prompt}\n\n"${content}"`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "Error: No data received from the neural net.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Return a user-friendly error string that fits the theme
    return "Critical Failure: Neural link disrupted. Check API Configuration or Network Connection.";
  }
};
