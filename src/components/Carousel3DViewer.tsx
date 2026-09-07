import React, { useState, useEffect } from 'react';
import { PlanType } from '../types';
import { ChevronLeft, ChevronRight, Play, Pause, Lock, Sparkles, Eye, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface Carousel3DViewerProps {
  plan: PlanType;
  fotoPortada?: string;
  fotosCarrusel?: string[];
  cardId?: string;
  serverBaseUrl?: string;
  className?: string;
}

export const Carousel3DViewer: React.FC<Carousel3DViewerProps> = ({
  plan,
  fotoPortada,
  fotosCarrusel = [],
  cardId,
  serverBaseUrl,
  className = ''
}) => {
  const isPaidPlan = plan !== 'basico';
  const allImages = React.useMemo(() => {
    const list: string[] = [];
    if (fotoPortada) list.push(fotoPortada);
    if (fotosCarrusel && fotosCarrusel.length > 0) {
      list.push(...fotosCarrusel);
    }
    // Fallback sample photos if empty
    if (list.length === 0) {
      return [
        'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80'
      ];
    }
    return list;
  }, [fotoPortada, fotosCarrusel]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showServerIframe, setShowServerIframe] = useState(false);

  // Auto rotation effect for 3D carousel
  useEffect(() => {
    if (!isPaidPlan || !autoRotate || allImages.length <= 1 || showServerIframe) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allImages.length);
      setRotationAngle((prev) => prev - (360 / allImages.length));
    }, 3500);
    return () => clearInterval(interval);
  }, [isPaidPlan, autoRotate, allImages.length, showServerIframe]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
    setRotationAngle((prev) => prev - (360 / allImages.length));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    setRotationAngle((prev) => prev + (360 / allImages.length));
  };

  // If basic plan: STRICTLY show only the cover photo
  if (!isPaidPlan) {
    return (
      <div className={`relative overflow-hidden rounded-2xl bg-[#0B2B40] border border-slate-700/50 shadow-xl ${className}`}>
        {/* Basic Plan Header tag */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/10 text-xs font-semibold">
          <span className="text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-[#FF8C00]" />
            Foto de Portada Oficial
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium text-[11px]">
            Plan Básico (Sin Carrusel)
          </span>
        </div>

        {/* Cover Photo */}
        <div className="relative aspect-video sm:aspect-[16/10] w-full bg-slate-900 flex items-center justify-center p-4">
          {fotoPortada ? (
            <img
              src={fotoPortada}
              alt="Portada TDI"
              className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
            />
          ) : (
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <ImageIcon className="w-8 h-8 text-[#FF8C00]" />
              </div>
              <p className="text-slate-300 font-medium text-sm">Foto de Portada / Logo</p>
              <p className="text-slate-500 text-xs mt-1">Sube tu logo para ver la previsualización</p>
            </div>
          )}
        </div>

        {/* Upgrade Banner for 3D Carousel */}
        <div className="p-3.5 bg-gradient-to-r from-[#0B2B40] to-[#071A27] border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Lock className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
            <span>Carrusel 3D disponible en planes <strong>Intermedio</strong>, <strong>Avanzado</strong> y <strong>Premium</strong></span>
          </div>
        </div>
      </div>
    );
  }

  // Server carousel URL if available
  const serverCarouselUrl = serverBaseUrl 
    ? `${serverBaseUrl}/carrusel-3d${cardId ? `?cardId=${cardId}` : ''}`
    : null;

  return (
    <div className={`relative rounded-2xl bg-gradient-to-b from-[#0B2B40] to-[#071A27] border border-[#FBBF24]/30 shadow-2xl overflow-hidden ${className}`}>
      {/* 3D Carousel Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-[#FBBF24]/20 text-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FBBF24] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8C00]"></span>
          </span>
          <span className="font-bold text-[#FBBF24] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
            Carrusel 3D del Servidor
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] font-bold uppercase tracking-wider border border-[#FF8C00]/30">
            {plan}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {serverCarouselUrl && (
            <button
              onClick={() => setShowServerIframe(!showServerIframe)}
              className="text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-white/10 flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {showServerIframe ? 'Ver 3D Local' : 'Ver Servidor Render'}
            </button>
          )}

          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className="p-1 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            title={autoRotate ? 'Pausar rotación' : 'Auto-rotar'}
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5 text-[#FBBF24]" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <span className="text-slate-400 font-mono text-[11px]">
            {currentIndex + 1}/{allImages.length}
          </span>
        </div>
      </div>

      {/* Main 3D Display Stage */}
      <div className="relative aspect-video sm:aspect-[16/10] w-full flex items-center justify-center overflow-hidden p-6 perspective-1000">
        
        {/* Option 1: Embedded Server Iframe if active */}
        {showServerIframe && serverCarouselUrl ? (
          <iframe
            src={serverCarouselUrl}
            title="Carrusel 3D Servidor"
            className="w-full h-full rounded-xl border border-white/10"
            onError={() => setShowServerIframe(false)}
          />
        ) : (
          /* Option 2: 3D Stage with cylindrical perspective rendering */
          <div className="relative w-full h-full flex items-center justify-center preserve-3d">
            {allImages.map((img, idx) => {
              const count = allImages.length;
              // Calculate offset relative to current
              let offset = (idx - currentIndex + count) % count;
              if (offset > count / 2) offset -= count;

              const isCurrent = offset === 0;
              const isAdjacent = Math.abs(offset) === 1;
              const isHidden = Math.abs(offset) > 1 && count > 3;

              if (isHidden) return null;

              // 3D positioning transform
              const translateX = offset * 48; // percentage
              const translateZ = isCurrent ? 50 : -80; // px depth
              const rotateY = offset * -25; // degrees angle
              const scale = isCurrent ? 1 : 0.82;
              const opacity = isCurrent ? 1 : 0.45;
              const zIndex = 20 - Math.abs(offset) * 5;

              return (
                <div
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    transform: `translateX(${translateX}%) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.6s ease'
                  }}
                  className={`absolute w-[70%] sm:w-[62%] h-[82%] rounded-2xl overflow-hidden cursor-pointer shadow-2xl transition-all duration-300 border-2 ${
                    isCurrent 
                      ? 'border-[#FBBF24] shadow-[#FF8C00]/20' 
                      : 'border-white/10 hover:opacity-80'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Diapositiva ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90 flex items-end p-3">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[11px] font-bold text-white uppercase tracking-wider bg-[#0B2B40]/80 px-2 py-0.5 rounded border border-[#FBBF24]/30">
                        {idx === 0 ? 'Portada' : `Slide ${idx + 1}`}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-[#FBBF24] font-semibold flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Activo 3D
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 3D Navigation Controls */}
        <button
          onClick={handlePrev}
          aria-label="Anterior foto"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-[#FF8C00] text-white transition-colors backdrop-blur-sm border border-white/20 shadow-lg"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          aria-label="Siguiente foto"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-[#FF8C00] text-white transition-colors backdrop-blur-sm border border-white/20 shadow-lg"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Footer thumbnail strip */}
      <div className="p-3 bg-black/50 border-t border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
          {allImages.map((thumb, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative flex-shrink-0 w-11 h-11 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === i 
                  ? 'border-[#FBBF24] scale-105 shadow-md shadow-[#FBBF24]/30' 
                  : 'border-white/20 opacity-50 hover:opacity-100'
              }`}
            >
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        <div className="flex-shrink-0 text-right">
          <span className="text-[11px] font-bold text-[#FBBF24] block">Efecto 3D Activo</span>
          <span className="text-[10px] text-slate-400">Gira automáticamente</span>
        </div>
      </div>
    </div>
  );
};
