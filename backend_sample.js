
import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080; 

// --- CONFIGURACIÓN DE CORS MEJORADA ---
// IMPORTANTE: Origin '*' es para desarrollo. En producción, especifica tu dominio.
app.use(cors({
  origin: true, // Refleja el origen de la solicitud
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.get('/', (req, res) => {
  res.send('Flux 1.1 Pro Proxy activo en Railway. Listo para generar.');
});

app.post('/api/generate', async (req, res) => {
  console.log('--- Nueva Solicitud Recibida ---');
  try {
    const { prompt, aspect_ratio, output_format, output_quality } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio' });
    }

    console.log('Generando para:', prompt.substring(0, 50) + '...');

    const output = await replicate.run(
      "black-forest-labs/flux-1.1-pro",
      {
        input: {
          prompt: prompt,
          aspect_ratio: aspect_ratio || "1:1",
          output_format: output_format || "webp",
          output_quality: output_quality || 80
        }
      }
    );

    res.status(200).json({ output });
    console.log('Éxito: Imagen generada.');

  } catch (error) {
    console.error('Error de Replicate:', error.message);
    res.status(500).json({ 
      error: 'Error en el backend de Railway', 
      details: error.message 
    });
  }
});

// Listener único obligatorio en 0.0.0.0
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
