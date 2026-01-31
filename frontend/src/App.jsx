
import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImage(null);

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error generando la imagen');
      }

      if (data.success && data.imageUrl) {
        setImage(data.imageUrl);
      } else {
        throw new Error('Respuesta inválida del servidor');
      }

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!image) return;
    try {
      // Fetch the image as a blob
      const response = await fetch(image);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename or default
      const timestamp = new Date().getTime();
      link.download = `flux-gen-${timestamp}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error downloading", e);
      // Fallback: open in new tab
      window.open(image, '_blank');
    }
  };

  return (
    <div className="app-container">
      <div className="glass-panel">
        <header className="header">
          <h1>Flux 1.1 Pro <span className="highlight">Generator</span></h1>
          <p>Crea imágenes de calidad ultra-realista con la potencia de Flux.</p>
        </header>

        <div className="input-group">
          <textarea
            placeholder="Describe tu imagen aquí... (Ej: 'Un paisaje futurista cyberpunk con luces de neón bajo la lluvia')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
            maxLength={1000}
            rows={3}
          />
          <div className="char-count">{prompt.length}/1000</div>
        </div>

        <button
          className={`generate-btn ${loading ? 'loading' : ''}`}
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <span className="loader">Generando...</span>
          ) : (
            '✨ Generar Imagen'
          )}
        </button>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {image && (
          <div className="result-container fade-in">
            <div className="image-wrapper">
              <img src={image} alt="Generada por Flux" />
            </div>
            <div className="actions">
              <button className="download-btn" onClick={handleDownload}>
                📥 Descargar WEBP
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        Powered by Replicate API & Flux 1.1 Pro
      </footer>
    </div>
  );
}

export default App;
