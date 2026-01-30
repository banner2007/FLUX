
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
      link.download = `flux-generation-${Date.now()}.webp`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      // Fallback
      window.open(imageUrl, '_blank');
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <div className="relative w-full aspect-square max-w-[512px] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse font-medium">Generando obra maestra...</p>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Generated content" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-slate-700 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            <p className="text-slate-500 font-medium">Tu imagen aparecerá aquí</p>
          </div>
        )}
      </div>

      {imageUrl && !isLoading && (
        <button 
          onClick={handleDownload}
          className="mt-6 flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 transition-colors rounded-xl text-white font-semibold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
          Descargar WEBP
        </button>
      )}
    </div>
  );
};

export default ImageDisplay;
