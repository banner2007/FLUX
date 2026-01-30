
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

    // Usamos el URL base directamente para asegurar consistencia con vercel.json
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    // Manejo específico del error 401 detectado en los logs
    if (response.status === 401) {
      throw new Error("ERROR 401: El despliegue de Vercel está protegido. Ve a Settings > Security y desactiva 'Vercel Authentication'.");
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error ${response.status}: El servidor no pudo procesar la solicitud.`);
    }

    const data: BackendResponse = await response.json();
    const imageUrl = Array.isArray(data.output) ? data.output[0] : data.output;

    if (!imageUrl) {
      throw new Error("La API no devolvió ninguna imagen.");
    }

    return { imageUrl };
  } catch (error: any) {
    console.error("Fetch Error:", error);
    
    // Si es un TypeError, suele ser un bloqueo de CORS/Red
    if (error.name === 'TypeError' || error.message.includes('fetch')) {
      return { 
        error: "ERROR DE CONEXIÓN: La política de CORS o la protección de Vercel bloqueó la petición. Verifica que el backend tenga 'Vercel Authentication' desactivado." 
      };
    }

    return { error: error.message };
  }
};
