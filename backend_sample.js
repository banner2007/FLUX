import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

// Cargar variables de entorno (útil para desarrollo local)
dotenv.config();

const app = express();

// Railway proporciona el puerto automáticamente en la variable PORT
const port = process.env.PORT || 3000;

// --- CONFIGURACIÓN DE CORS ---
// Esto permite que tu frontend en Cloud Run haga peticiones sin ser bloqueado
app.use(cors({
  origin: '*', // Permite todos los orígenes
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Inicializar el cliente de Replicate con tu Token de Railway
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Ruta base para verificar que el servidor está encendido
app.get('/', (req, res) => {
  res.send('Servidor Backend de Flux operando en Railway');
});

// Ruta principal para generar imágenes
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, aspect_ratio, output_format, output_quality } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'El prompt es obligatorio' });
    }

    console.log(`Solicitud recibida. Generando: "${prompt}"`);

    // Llamada al modelo Flux en Replicate
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

    // Replicate devuelve la URL de la imagen (o un array de ellas)
    res.status(200).json({ output });

  } catch (error) {
    console.error('Error detectado en el servidor:', error.message);
    res.status(500).json({ 
      error: 'Error al generar la imagen', 
      details: error.message 
    });
  }
});

// Escuchar en 0.0.0.0 es REQUISITO para que Railway detecte el servicio
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});