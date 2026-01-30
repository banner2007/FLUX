import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Railway asigna el puerto dinámicamente, por eso usamos process.env.PORT
const port = process.env.PORT || 8080; 

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor activo y escuchando en el puerto ${port}`);
});

// --- CONFIGURACIÓN DE CORS (CRUCIAL) ---
app.use(cors({
  origin: '*', // Permite que tu frontend en Cloud Run acceda
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Inicializar Replicate con tu variable de entorno de Railway
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Ruta de salud para verificar que Railway activó el servidor
app.get('/', (req, res) => {
  res.send('Backend de FLUX funcionando en Railway');
});

// Ruta principal de generación
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, aspect_ratio, output_format, output_quality } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio' });
    }

    console.log('Generando imagen para el prompt:', prompt);

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

    // Respondemos con el JSON que espera tu frontend
    res.status(200).json({ output });

  } catch (error) {
    console.error('Error de Replicate:', error.message);
    res.status(500).json({ 
      error: 'Error en el servidor de Railway', 
      details: error.message 
    });
  }
});

// Escuchar en 0.0.0.0 es obligatorio en Railway
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor activo y escuchando en el puerto ${port}`);
});