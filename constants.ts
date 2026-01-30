
// Configuración de endpoints y constantes globales
export const BACKEND_URL = "https://flux-production-593a.up.railway.app/api/generate";

export const DEFAULT_CONFIG = {
  aspect_ratio: "1:1" as const,
  output_format: "webp" as const,
  output_quality: 80,
  safety_tolerance: 2,
  prompt_upsampling: true
};
