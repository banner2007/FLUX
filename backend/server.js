
const express = require("express");
const Replicate = require("replicate");
const cors = require("cors");
const dotenv = require("dotenv");

console.log("Starting Flux Backend...");

try {
    dotenv.config();
} catch (e) {
    console.warn("Dotenv config failed (optional if env vars are system-wide):", e);
}

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Flux Backend OK");
});

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Inicializar Replicate lazy (dentro del request) o con try-catch para no romper startup
app.post("/generate", async (req, res) => {
    console.log("POST /generate hit");
    try {
        // Limpiar token de espacios accidentales (trim)
        const rawToken = process.env.REPLICATE_API_TOKEN || "";
        const token = rawToken.trim();

        // Debug de token (Solo mostramos longitudes y primeros caracteres para seguridad)
        console.log(`Token status: Length=${token.length}, StartsWith=${token.substring(0, 4)}...`);

        if (!token) {
            console.error("❌ Token no encontrado o vacío después de trim.");
            throw new Error("Missing REPLICATE_API_TOKEN (Empty)");
        }

        const replicate = new Replicate({ auth: token });
        const { prompt } = req.body;

        if (!prompt) return res.status(400).json({ error: "Prompt required" });

        let output = await replicate.run("black-forest-labs/flux-1.1-pro", {
            input: {
                prompt,
                aspect_ratio: "1:1",
                output_format: "webp",
                output_quality: 80,
                safety_tolerance: 2,
                prompt_upsampling: true
            }
        });

        console.log("Flux Raw Output Type:", typeof output);

        // Si es un Stream, lo pipeamos directo a la respuesta
        if (output && typeof output.pipe === 'function') {
            console.log("Streaming response directly to client...");

            // Configurar headers correctos para la imagen
            res.setHeader('Content-Type', 'image/webp');

            // Pipear el stream de Replicate directo al response de Express
            output.pipe(res);

            // Manejar errores del stream
            output.on('error', (err) => {
                console.error("Stream error:", err);
                if (!res.headersSent) {
                    res.status(500).json({ error: "Error streaming image" });
                }
            });
            return; // Importante: salir de la función aquí
        }

        // Si no es stream (es URL o algo más), enviamos JSON normal
        if (Array.isArray(output)) {
            output = output[0];
        }

        console.log("Sending JSON response...");
        res.json({ success: true, imageUrl: output });

    } catch (err) {
        console.error("Gen Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});
