
import { ReplicateInput, GenerationResponse, BackendResponse } from '../types.ts';
import { BACKEND_URL, DEFAULT_CONFIG } from '../constants.ts';
import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  try {
    const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : null;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    return null;
  }
};

export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  const ai = getAI();
  if (!ai) return originalPrompt;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an elite prompt engineer for Flux 1.1 Pro. 
      TASK: Transform this concept into a technical, high-quality prompt: "${originalPrompt}" 
      REQUIREMENTS: 
      - Use professional photography terminology (cinematic lighting, f/1.8, depth of field).
      - Add specific artistic styles and textures.
      - Output ONLY the final prompt string, no conversational text.`,
    });
    return response.text?.trim() || originalPrompt;
  } catch (error) {
    console.error("Gemini Enhancement Error:", error);
    return originalPrompt;
  }
};

export const generateImage = async (prompt: string): Promise<GenerationResponse> => {
  if (!prompt.trim()) return { error: "El prompt está vacío." };

  try {
    const payload: ReplicateInput = {
      prompt,
      ...DEFAULT_CONFIG
    };

    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error del servidor (${response.status})`);
    }

    const data: BackendResponse = await response.json();
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;

    if (!imageUrl) throw new Error("La API no devolvió ninguna URL de imagen.");

    return { imageUrl };
  } catch (error: any) {
    console.error("Generation API Error:", error);
    if (error.name === 'TypeError') {
      return { error: "Fallo de conexión. Verifica si el backend está activo o si hay un bloqueo de CORS." };
    }
    return { error: error.message || "Ocurrió un error inesperado al generar la imagen." };
  }
};
