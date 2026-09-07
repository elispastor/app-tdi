import React, { useState } from 'react';
import { TdiCard, PlanType } from '../types';
import { PLANS } from '../data/plans';
import { Carousel3DViewer } from './Carousel3DViewer';
import { ExternalLink, Copy, Share2, Plus, Calendar, Sparkles, Layers, QrCode } from 'lucide-react';

interface MyCardsListProps {
  cards: TdiCard[];
  onNavigateToCreate: () => void;
  onSelectPlan: (plan: PlanType) => void;
}

export const MyCardsList: React.FC<MyCardsListProps> = ({
  cards,
  onNavigateToCreate,
  onSelectPlan
}) => {
  const [selectedCardForPreview, setSelectedCardForPreview] = useState<TdiCard | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (card: TdiCard) => {
    navigator.clipboard.writeText(card.enlace);
    setCopiedId(card.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-6">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FBBF24]/20 text-[#0B2B40] border border-[#FBBF24]/40">
            Almacenamiento Firebase
          </span>
          <h1 className="text-3xl font-extrabold text-[#0B2B40] font-heading mt-1">
            Mis Tarjetas Digitales Inteligentes
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Gestiona tus enlaces únicos emitidos por el servidor TDI en Render.
          </p>
        </div>

        <button
          onClick={onNavigateToCreate}
          className="px-5 py-2.5 rounded-xl font-heading font-bold text-sm bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Tarjeta</span>
        </button>
      </div>

      {cards.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-xl mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-100 text-[#FF8C00] flex items-center justify-center">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-[#0B2B40] mb-2">
            Aún no tienes tarjetas generadas
          </h3>
          <p className="text-slate-500 text-sm mb-6">
            Elige un plan (Básico, Intermedio, Avanzado o Premium), sube tu logo y genera tu primera Tarjeta Digital Inteligente.
          </p>
          <button
            onClick={onNavigateToCreate}
            className="px-6 py-3 rounded-xl bg-[#0B2B40] text-[#FBBF24] font-bold text-sm hover:bg-[#0B2B40]/90 transition-all shadow"
          >
            Comenzar ahora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => {
            const plan = PLANS[card.plan];
            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Top image or 3D banner preview */}
                  <div className="relative aspect-video bg-slate-900 overflow-hidden">
                    <img
                      src={card.fotoPortada}
                      alt={card.nombre}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0B2B40]/90 text-[#FBBF24] border border-[#FBBF24]/30 uppercase">
                        {plan?.name || card.plan}
                      </span>
                    </div>
                    {card.plan !== 'basico' && (
                      <div className="absolute top-3 right-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8C00] text-white flex items-center gap-1 shadow">
                          <Sparkles className="w-3 h-3" /> Carrusel 3D
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-[#0B2B40]">
                      {card.nombre}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Tel: {card.telefono} • {card.email}
                    </p>

                    <div className="mt-4 p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-600 truncate max-w-[200px]">
                        {card.enlace}
                      </span>
                      <button
                        onClick={() => handleCopy(card)}
                        className="text-[#FF8C00] hover:text-[#FF8C00]/80 font-bold ml-2 flex-shrink-0 flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedId === card.id ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{new Date(card.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCardForPreview(card)}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 text-center transition-colors"
                  >
                    Ver 3D / Portada
                  </button>

                  <a
                    href={card.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg text-xs font-bold bg-[#0B2B40] text-[#FBBF24] hover:bg-[#0B2B40]/90 flex items-center gap-1 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Abrir</span>
                  </a>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hola, te comparto mi Tarjeta Digital Inteligente: ${card.enlace}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                    title="Compartir en WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* PREVIEW MODAL */}
      {selectedCardForPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 rounded-3xl max-w-md w-full p-6 border border-[#FBBF24]/30 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-white text-lg">
                  {selectedCardForPreview.nombre}
                </h3>
                <span className="text-xs text-[#FBBF24]">
                  Visualizador TDI • Plan {selectedCardForPreview.plan.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedCardForPreview(null)}
                className="text-slate-400 hover:text-white text-sm px-2 py-1 rounded-lg bg-white/10"
              >
                Cerrar
              </button>
            </div>

            <Carousel3DViewer
              plan={selectedCardForPreview.plan}
              fotoPortada={selectedCardForPreview.fotoPortada}
              fotosCarrusel={selectedCardForPreview.fotosCarrusel}
              cardId={selectedCardForPreview.id}
            />

            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 truncate max-w-[240px]">
                {selectedCardForPreview.enlace}
              </span>
              <a
                href={selectedCardForPreview.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#FF8C00] text-white text-xs font-bold flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Visitar
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
