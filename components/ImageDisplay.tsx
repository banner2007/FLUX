
import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading }) => {
  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `flux-gen-${Date.now()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full aspect-square bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-700">
        
        {/* Decorative elements */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-slate-800 rounded-tl-xl pointer-events-none opacity-50"></div>
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-slate-800 rounded-br-xl pointer-events-none opacity-50"></div>

        {isLoading ? (
          <div className="flex flex-col items-center gap-6 z-10">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/10 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 w-12 h-12 border-4 border-blue-400/20 border-b-blue-400 rounded-full animate-spin [animation-duration:1.5s]"></div>
            </div>
            <div className="text-center space-y-1">
              <p className="text-blue-400 font-bold tracking-tight text-lg animate-pulse-soft">Creando Imagen...</p>
              <p className="text-slate-500 text-xs uppercase tracking-widest font-medium">Flux Engine 1.1 Pro is thinking</p>
            </div>
          </div>
        ) : imageUrl ? (
          <div className="w-full h-full relative group">
            <img 
              src={imageUrl} 
              alt="Flux Generation" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        ) : (
          <div className="text-center p-12 max-w-sm z-10">
            <div className="w-24 h-24 bg-slate-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-800 group transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-slate-700 group-hover:text-blue-500 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-300 mb-2">Lienzo Vacío</h3>
            <p className="text-slate-500 text-sm leading-relaxed">Configura tu prompt y deja que Flux transforme tus palabras en una obra maestra digital.</p>
          </div>
        )}
      </div>

      {imageUrl && !isLoading && (
        <div className="mt-8 flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-2xl text-white font-bold shadow-xl border border-slate-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            Guardar en 8K WebP
          </button>
          <button 
            onClick={() => window.open(imageUrl, '_blank')}
            className="p-4 bg-slate-800 hover:bg-slate-700 transition-all rounded-2xl text-white border border-slate-700 shadow-xl"
            title="Abrir en pantalla completa"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
