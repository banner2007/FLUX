import { ReplicateInput, GenerationResponse, BackendResponse } from '../types';
import { BACKEND_URL, DEFAULT_CONFIG } from '../constants';

export const generateImage = async (prompt: string): Promise<GenerationResponse> => {
  if (!prompt.trim()) {
    return { error: "Por favor, escribe un prompt." };
  }

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

    // Manejo de errores de autorización (CORS a menudo se confunde aquí)
    if (response.status === 401) {
      throw new Error("ERROR 401: No autorizado. Verifica el REPLICATE_API_TOKEN en Railway.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: El servidor no respondió correctamente.`);
    }

    const data: BackendResponse = await response.json();
    
    // Extraemos la URL (Replicate a veces devuelve un string o un array)
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;

    if (!imageUrl) {
      throw new Error("La API no devolvió ninguna imagen.");
    }

    return { imageUrl };
  } catch (error: any) {
    console.error("Fetch Error:", error);
    
    // Este es el mensaje que ves cuando fallan los CORS
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return { 
        error: "ERROR DE CONEXIÓN: Verifica los CORS en el backend de Railway y que la URL sea correcta." 
      };
    }

    return { error: error.message };
  }
};
