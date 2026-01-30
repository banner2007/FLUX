
/**
 * Vercel Serverless Function: api/generate.js
 * INSTRUCCIONES: Este archivo debe estar en la carpeta /api/ de tu proyecto de backend.
 */
import Replicate from 'replicate';

export default async function handler(req, res) {
  // 1. Cabeceras CORS - DEBEN estar al principio y sin errores de sintaxis
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');

  // 2. Manejo de Preflight (Crucial para evitar el error de los logs)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Validación de método
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { prompt, ...config } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es obligatorio." });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return res.status(500).json({ error: "Configuración incompleta: falta REPLICATE_API_TOKEN en el servidor." });
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN,
    });

    // Ejecución del modelo Flux 1.1 Pro
    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: prompt,
          aspect_ratio: config.aspect_ratio || "1:1",
          output_format: config.output_format || "webp",
          output_quality: config.output_quality || 80,
          safety_tolerance: config.safety_tolerance || 2,
          prompt_upsampling: config.prompt_upsampling !== undefined ? config.prompt_upsampling : true
        }
      }
    );

    return res.status(200).json({ output });

  } catch (error) {
    console.error("Replicate Error:", error);
    return res.status(500).json({ 
      error: error.message || "Error al generar la imagen en Replicate."
    });
  }
}
