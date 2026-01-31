
const express = require("express");
const Replicate = require("replicate");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuración CORS Excesivamente Permisiva para Debugging
// 1. Permitir cualquier origen
// 2. Manejar OPTIONS pre-flight explícitamente
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

// Preflight request handler explícito
app.options('*', cors());

// Middleware para asegurar headers CORS incluso si hay error
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(express.json());

// Chequeo de salud simple
app.get("/", (req, res) => {
    res.status(200).send(`Flux Backend Online. Port: ${PORT}`);
});

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN, // Railway debe tener esta variable
});

app.post("/generate", async (req, res) => {
    console.log("Recibida petición POST /generate");
    try {
        const { prompt } = req.body;

        if (!prompt) {
            console.error("Error: Prompt vacío");
            return res.status(400).json({ error: "El prompt es obligatorio." });
        }

        console.log("Iniciando generación con Flux 1.1 Pro para prompt:", prompt.substring(0, 50) + "...");

        // Verificar token antes de llamar
        if (!process.env.REPLICATE_API_TOKEN) {
            console.error("FATAL: REPLICATE_API_TOKEN no encontrado en environment");
            return res.status(500).json({ error: "Error de configuración en el servidor (Token faltante)." });
        }

        const input = {
            prompt: prompt,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 80,
            safety_tolerance: 2,
            prompt_upsampling: true
        };

        const output = await replicate.run("black-forest-labs/flux-1.1-pro", { input });

        console.log("Éxito. URL de imagen:", output);
        res.json({ success: true, imageUrl: output });

    } catch (error) {
        console.error("🔥 Error crítico generando imagen:", error);

        // Devolvemos status 500 pero aseguramos respuesta JSON válida
        const errorMessage = error.response?.statusText || error.message || "Error desconocido";

        res.status(500).json({
            error: "Error procesando la solicitud en Replicate.",
            details: errorMessage
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Servidor backend escuchando en http://0.0.0.0:${PORT}`);
});
