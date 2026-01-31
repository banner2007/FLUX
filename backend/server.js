
const express = require("express");
const Replicate = require("replicate");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for frontend access
app.use(cors());
app.use(express.json());

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es obligatorio." });
    }

    console.log("Generando imagen para:", prompt);

    // Configuración base del usuario (NO MODIFICAR)
    const input = {
      prompt: prompt,
      aspect_ratio: "1:1",
      output_format: "webp",
      output_quality: 80,
      safety_tolerance: 2,
      prompt_upsampling: true
    };

    const output = await replicate.run("black-forest-labs/flux-1.1-pro", { input });

    console.log("Imagen generada:", output);
    res.json({ success: true, imageUrl: output });

  } catch (error) {
    console.error("Error generando la imagen:", error);
    
    // Manejo de errores específicos
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Clave de API inválida o no configurada." });
    }
    if (error.message.includes("NSFW")) {
       return res.status(400).json({ error: "El prompt fue rechazado por filtros de seguridad." });
    }

    res.status(500).json({ 
      error: "Error interno del servidor generando la imagen.", 
      details: error.message 
    });
  }
});

app.get("/", (req, res) => {
  res.send("Flux Image Generator API is running.");
});

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
