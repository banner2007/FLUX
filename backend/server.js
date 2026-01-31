
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
        const token = process.env.REPLICATE_API_TOKEN;
        if (!token) {
            throw new Error("Missing REPLICATE_API_TOKEN");
        }

        const replicate = new Replicate({ auth: token });
        const { prompt } = req.body;

        if (!prompt) return res.status(400).json({ error: "Prompt required" });

        const output = await replicate.run("black-forest-labs/flux-1.1-pro", {
            input: {
                prompt,
                aspect_ratio: "1:1",
                output_format: "webp",
                output_quality: 80,
                safety_tolerance: 2,
                prompt_upsampling: true
            }
        });

        console.log("Gen OK:", output);
        res.json({ success: true, imageUrl: output });

    } catch (err) {
        console.error("Gen Error:", err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on 0.0.0.0:${PORT}`);
});
