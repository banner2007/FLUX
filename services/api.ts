
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

    if (response.status === 401) {
      throw new Error("ERROR 401: No autorizado. Verifica que el REPLICATE_API_TOKEN sea correcto en Railway.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: El servidor de Railway no pudo procesar la solicitud.`);
    }

    const data: BackendResponse = await response.json();
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;

    if (!imageUrl) {
      throw new Error("La API de Replicate no devolvió ninguna imagen.");
    }

    return { imageUrl };
  } catch (error: any) {
    console.error("Fetch Error:", error);
    
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return { 
        error: "ERROR DE CONEXIÓN: No se pudo contactar con el backend en Railway. Verifica que el servicio esté activo y los CORS permitidos." 
      };
    }

    return { error: error.message };
  }
};
