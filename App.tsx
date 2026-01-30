
import React, { useState } from 'react';
import Header from './components/Header';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/api';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setError(null);
    setIsLoading(true);
    
    try {
      const response = await generateImage(prompt);
      
      if (response.error) {
        setError(response.error);
      } else if (response.imageUrl) {
        setImageUrl(response.imageUrl);
      }
    } catch (err: any) {
      setError("Fallo crítico en la comunicación con el backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <Header />
      
      <main className="flex-grow p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 text-white">Flux 1.1 Pro Studio</h2>
            
            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ej: Un astronauta montando un caballo en Marte, estilo cinematográfico..."
                className="w-full h-32 bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                disabled={isLoading}
              />

              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg transition-all
                  ${isLoading || !prompt.trim() 
                    ? 'bg-slate-800 text-slate-500' 
                    : 'bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.99] shadow-lg shadow-blue-900/20'}
                `}
              >
                {isLoading ? 'Generando Imagen...' : 'Generar Ahora'}
              </button>
            </div>

            {error && (
              <div className="mt-6 p-5 bg-red-900/30 border border-red-500/50 rounded-2xl text-red-200">
                <div className="flex items-center gap-2 font-bold mb-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  Error de Servidor / CORS
                </div>
                <p className="text-sm opacity-90">{error}</p>
                <div className="mt-3 p-3 bg-black/20 rounded-lg text-xs">
                  <strong>Acción requerida:</strong> Si acabas de actualizar el código, asegúrate de desplegar el archivo <code>vercel.json</code> y el backend en tu proyecto de Vercel para aplicar los permisos de red.
                </div>
              </div>
            )}

            <ImageDisplay imageUrl={imageUrl} isLoading={isLoading} />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm">
        Flux 1.1 Pro &bull; Replicate SDK &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default App;
