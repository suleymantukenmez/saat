import { GoogleGenAI, Type, Schema } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Define the response schema for the quote
const quoteSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The quote text.",
    },
    author: {
      type: Type.STRING,
      description: "The author of the quote.",
    },
  },
  required: ["text", "author"],
};

export const fetchTimeQuote = async (): Promise<{ text: string; author: string } | null> => {
  if (!apiKey) {
    console.warn("Gemini API Key is missing.");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a short, profound, or motivating quote about time, patience, or focus. It should be suitable for a clock display.",
      config: {
        responseMimeType: "application/json",
        responseSchema: quoteSchema,
        temperature: 1.0, 
      },
    });

    const jsonText = response.text;
    if (!jsonText) return null;

    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error fetching quote from Gemini:", error);
    return null;
  }
};