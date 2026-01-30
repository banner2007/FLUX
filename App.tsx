
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import ImageDisplay from './components/ImageDisplay.tsx';
import { generateImage, enhancePrompt } from './services/api.ts';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // Intentar cargar historial previo de localStorage si fuera necesario
  }, []);

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    setError(null);
    try {
      const enhanced = await enhancePrompt(prompt);
      if (enhanced) setPrompt(enhanced);
    } catch (err) {
      setError("No se pudo optimizar el prompt con Gemini.");
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setError(null);
    setIsLoading(true);
    
    try {
      const response = await generateImage(prompt);
      
      if (response.error) {
        setError(response.error);
      } else if (response.imageUrl) {
        setImageUrl(response.imageUrl);
        setHistory(prev => [response.imageUrl!, ...prev.slice(0, 7)]);
      }
    } catch (err: any) {
      setError("Error crítico de red. Revisa el estado del servidor en Railway.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Panel Lateral: Controles Artísticos */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group">
              {/* Barra de acento superior */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 opacity-80"></div>
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Studio Pro</h2>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Flux 1.1 Pro Engine</p>
                </div>
                <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                  <span className="text-[10px] font-black text-blue-400">MODO EXPERTO</span>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Concepto Artístico</label>
                    <button 
                      onClick={() => setPrompt('')} 
                      className="text-[10px] text-slate-600 hover:text-blue-400 font-bold uppercase transition-colors"
                    >
                      Reiniciar
                    </button>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ej: Un palacio flotante sobre un mar de cristales, luz de atardecer cinematográfico, 8k, detalles hiperrealistas..."
                      className="w-full h-48 bg-slate-900/40 border border-white/5 rounded-3xl p-6 text-white placeholder-slate-700 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/40 outline-none transition-all resize-none leading-relaxed text-sm"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleEnhance}
                      disabled={isLoading || isEnhancing || !prompt.trim()}
                      className="absolute bottom-5 right-5 p-3 bg-slate-800 hover:bg-blue-600 rounded-2xl text-slate-400 hover:text-white transition-all border border-white/10 hover:border-blue-400 shadow-xl disabled:opacity-30 disabled:hover:scale-100 active:scale-95 group/btn"
                      title="Optimizar prompt con Gemini AI"
                    >
                      {isEnhancing ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                          <span className="text-[10px] font-black uppercase tracking-tighter hidden group-hover/btn:block">Mejorar</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isLoading || !prompt.trim()}
                  className={`
                    w-full py-5 rounded-3xl font-black text-xs uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-4
                    ${isLoading || !prompt.trim() 
                      ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Renderizando...</span>
                    </>
                  ) : (
                    <>
                      <span>Generar Masterpiece</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl animate-in fade-in slide-in-from-top-2">
                  <div className="flex gap-4">
                    <div className="mt-1 flex-shrink-0 text-red-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Error de Sistema</h4>
                      <p className="text-[11px] text-red-400/80 leading-relaxed font-medium">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Galería de Sesión */}
            {history.length > 0 && (
              <div className="glass-card rounded-[2rem] p-6 hidden md:block border-white/5">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-1">Recientes</h3>
                <div className="grid grid-cols-4 gap-3">
                  {history.map((url, i) => (
                    <button 
                      key={i} 
                      className="aspect-square rounded-[1rem] overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all group/hist"
                      onClick={() => setImageUrl(url)}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover opacity-60 group-hover/hist:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Panel Principal: Visualizador */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <ImageDisplay imageUrl={imageUrl} isLoading={isLoading} />
          </div>

        </div>
      </main>
      
      <footer className="py-10 border-t border-white/5 bg-slate-950/20 backdrop-blur-lg">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-slate-600 uppercase tracking-[0.3em] font-semibold">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Sistema Operativo v1.4.2</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-default transition-colors">Quantum AI Pipeline</span>
            <span className="opacity-20">/</span>
            <span className="hover:text-slate-400 cursor-default transition-colors">Black Forest Labs</span>
            <span className="opacity-20">/</span>
            <span className="hover:text-slate-400 cursor-default transition-colors">Flux 1.1 Pro</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
