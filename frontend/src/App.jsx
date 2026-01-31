
import { useState } from 'react';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [stylePreset, setStylePreset] = useState('Advertising');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use local proxy to avoid CORS
  const API_URL = '/api';

  const aspectRatios = [
    { label: 'Cuadrado (1:1)', value: '1:1', icon: 'square' },
    { label: 'Retrato (9:16)', value: '9:16', icon: 'smartphone' }, // TikTok/Reels
    { label: 'Paisaje (16:9)', value: '16:9', icon: 'monitor' },    // YouTube
    { label: 'Clásico (3:2)', value: '3:2', icon: 'crop_3_2' },
    { label: 'Vertical (2:3)', value: '2:3', icon: 'crop_portrait' },
    { label: 'Ultra Wide (21:9)', value: '21:9', icon: 'panorama' },
  ];

  const styles = [
    { label: '📢 Publicidad (Pro)', value: 'Advertising' },
    { label: '🎬 Cinemático', value: 'Cinematic' },
    { label: '📸 Fotografía Realista', value: 'Photography' },
    { label: '🎌 Anime / Manga', value: 'Anime' },
    { label: '🧊 Render 3D', value: '3D Render' },
    { label: '📝 Raw (Sin filtros)', value: 'Raw' },
  ];

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
        body: JSON.stringify({
          prompt,
          aspect_ratio: aspectRatio,
          style_preset: stylePreset
        }),
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
    const link = document.createElement('a');
    link.href = image; // Es base64
    link.download = `flux-${aspectRatio.replace(':', '-')}-${new Date().getTime()}.webp`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-layout">
      {/* Sidebar de Herramientas */}
      <aside className="sidebar">
        <div className="logo">
          ⚡ Flux<span className="highlight">Studio</span>
        </div>

        <div className="tool-section">
          <h3>📐 Relación de Aspecto</h3>
          <div className="options-grid">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                className={`option-btn ${aspectRatio === ratio.value ? 'active' : ''}`}
                onClick={() => setAspectRatio(ratio.value)}
                title={ratio.label}
              >
                {ratio.value}
              </button>
            ))}
          </div>
        </div>

        <div className="tool-section">
          <h3>🎨 Estilo Visual</h3>
          <div className="options-list">
            {styles.map((style) => (
              <button
                key={style.value}
                className={`style-btn ${stylePreset === style.value ? 'active' : ''}`}
                onClick={() => setStylePreset(style.value)}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="main-content">
        <header className="main-header">
          <h2>Generador Profesional</h2>
          <p>Diseña activos visuales de alto impacto con Flux 1.1 Pro</p>
        </header>

        <div className="workspace">
          {/* Zona de Visualización */}
          <div className={`preview-area ${image ? 'has-image' : 'empty'}`}>
            {loading && (
              <div className="loading-overlay">
                <div className="loader"></div>
                <span>Renderizando {aspectRatio}...</span>
              </div>
            )}

            {!image && !loading && (
              <div className="placeholder">
                <div className="placeholder-icon">🖼️</div>
                <p>Tu creatividad aparecerá aquí</p>
              </div>
            )}

            {image && (
              <img src={image} alt="Generado por Flux" className="generated-image" />
            )}

            {image && !loading && (
              <div className="image-overlay">
                <button onClick={handleDownload} className="action-btn">📥 Descargar WEBP</button>
              </div>
            )}
          </div>

          {/* Barra de Input (Bottom) */}
          <div className="input-bar">
            <textarea
              placeholder="¿Qué deseas crear hoy? (Ej: 'Un gato astronauta en Marte estilo cyberpunk')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <button
              className="generate-btn-main"
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
            >
              {loading ? '...' : '✨ GENERAR'}
            </button>
          </div>

          {error && <div className="toast-error">{error}</div>}
        </div>
      </main>
    </div>
  );
}

export default App;
