
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
app.use(express.json({ limit: '10mb' })); // Aumentamos límite para recibir imágenes Base64

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

        // 🧠 Director Creativo "Hardcoded" para Flux
        // Traducimos la lógica de negocio a instrucciones visuales que Flux entiende
        const adStyle = "Professional high-impact advertising photography, commercial aesthetics, scroll-stopper visual, modern design trends, dramatic studio lighting, clear negative space for copy, highly persuasive, 8k resolution, sharp focus, hyper-realistic texture, emotional connection.";

        // Combinamos la idea del usuario con el estilo del director
        const enhancedPrompt = `Advertising shot of ${prompt}. ${adStyle}`;

        console.log("🎨 Prompt Optimizado:", enhancedPrompt);

        let output = await replicate.run("black-forest-labs/flux-1.1-pro", {
            input: {
                prompt: enhancedPrompt, // Usamos el prompt mejorado
                aspect_ratio: "1:1",
                output_format: "webp",
                output_quality: 80,
                safety_tolerance: 2,
                prompt_upsampling: true
            }
        });


        console.log("Flux Raw Output Type:", typeof output);
        console.log("Is Array?", Array.isArray(output));

        // Detección de Stream más robusta (Soporte para Node Stream Y Web Standard Stream)
        const isStream = output && (
            typeof output.pipe === 'function' ||
            output.constructor.name === 'ReadableStream' ||
            typeof output.getReader === 'function'
        );

        if (isStream) {
            console.log("🔄 Stream detectado. Descargando a Buffer...");

            const chunks = [];

            // Estrategia de consumo híbrida
            if (typeof output.getReader === "function") {
                // Es un Web Stream (Standard)
                console.log("👉 Usando Reader de Web Stream");
                const reader = output.getReader();
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    if (value) chunks.push(Buffer.from(value));
                }
            } else {
                // Es un Node Stream o Iterable
                console.log("👉 Usando Iterador Async");
                for await (const chunk of output) {
                    chunks.push(Buffer.from(chunk));
                }
            }

            const buffer = Buffer.concat(chunks);
            console.log(`✅ Buffer descargado. Tamaño: ${buffer.length} bytes`);

            // Convertir a Base64
            const base64Image = buffer.toString('base64');
            const dataURI = `data:image/webp;base64,${base64Image}`;

            console.log("📤 Enviando JSON con Base64...");
            return res.json({ success: true, imageUrl: dataURI });
        }

        // 2. Si es un Array (a veces pasa en modo predicción)
        if (Array.isArray(output)) {
            console.log("⚠️ Output es Array, tomando primer elemento");
            output = output[0];
        }

        // 3. Si es String (URL directa)
        if (typeof output === 'string') {
            console.log("🔗 Output es URL directa");
            return res.json({ success: true, imageUrl: output });
        }

        console.log("❓ Output desconocido:", output);
        res.status(500).json({ error: "Formato de salida no reconocido por el backend" });

    } catch (err) {
        console.error("Gen Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});
