import React from 'react';
import { PlanType } from '../types';
import { PLANS, formatCOP } from '../data/plans';
import { Carousel3DViewer } from './Carousel3DViewer';
import { Sparkles, ArrowRight, ShieldCheck, Crown, Layers, MessageSquare, Zap, CheckCircle2 } from 'lucide-react';

interface HomeHeroProps {
  onSelectTab: (tab: 'home' | 'plans' | 'create' | 'cards' | 'chat') => void;
  onSelectPlan: (plan: PlanType) => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onSelectTab,
  onSelectPlan
}) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B2B40] via-[#071A27] to-[#040E15] text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#FBBF24]/20 shadow-2xl">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF8C00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#FBBF24]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Pitch (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-[#FBBF24]/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#FF8C00] animate-ping" />
              <span className="text-xs font-bold text-[#FBBF24] tracking-wide">
                Proyecto Oficial TDI • Guía Digital Cúcuta
              </span>
            </div>

            <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.1]">
              Tu Presencia Digital al Siguiente Nivel con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] via-[#FBBF24] to-[#FF8C00]">Tarjeta Digital Inteligente</span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              Conéctate instantáneamente con clientes, muestra tus productos en un <strong>Carrusel 3D interactivo</strong> y aprovecha la atención 24/7 de nuestro <strong>Agente Pulpo 🐙</strong> alojado en Render.
            </p>

            {/* Quick Benefits Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
                <span>Enlace único y código QR dinámico</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FBBF24] flex-shrink-0" />
                <span>Carrusel 3D para planes pagos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8C00] flex-shrink-0" />
                <span>Asistente Pulpo IA en /chat</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FF8C00] flex-shrink-0" />
                <span>Persistencia segura en Firebase</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                id="hero-btn-create"
                onClick={() => onSelectTab('create')}
                className="px-8 py-4 rounded-xl font-heading font-extrabold text-sm sm:text-base bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] shadow-lg shadow-[#FF8C00]/30 hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5 text-[#0B2B40]" />
                <span>Crear mi Tarjeta TDI</span>
                <ArrowRight className="w-4 h-4 text-[#0B2B40]" />
              </button>

              <button
                id="hero-btn-pulpo"
                onClick={() => onSelectTab('chat')}
                className="px-6 py-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all flex items-center gap-2.5"
              >
                <img 
                  src="/pulpo-avatar.jpg" 
                  alt="" 
                  className="w-5 h-5 rounded-full object-cover border border-[#FF8C00]"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
                <span>Hablar con Pulpo 🐙</span>
              </button>

              <button
                id="hero-btn-plans"
                onClick={() => onSelectTab('plans')}
                className="px-4 py-4 text-sm font-semibold text-[#FBBF24] hover:underline"
              >
                Ver los 4 Planes ($25k - $200k)
              </button>
            </div>

          </div>

          {/* Right Hero Demo 3D Mockup (5 cols) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-sm">
              
              {/* Floating Pulpo Tag */}
              <div 
                onClick={() => onSelectTab('chat')}
                className="cursor-pointer absolute -top-5 -right-4 z-30 bg-[#0B2B40] border-2 border-[#FBBF24] rounded-2xl p-2 px-3 shadow-xl flex items-center gap-2.5 hover:scale-105 transition-transform"
              >
                <img
                  src="/pulpo-avatar.jpg"
                  alt="Pulpo"
                  className="w-8 h-8 rounded-full object-cover border border-[#FF8C00]"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#FBBF24] block">Asistente TDI</span>
                  <span className="text-xs font-extrabold text-white">Pulpo en Línea 🐙</span>
                </div>
              </div>

              {/* 3D Showcase Component */}
              <div className="rounded-[36px] p-4 bg-gradient-to-b from-[#0B2B40] to-black border-4 border-[#0B2B40] shadow-2xl text-white">
                <div className="flex items-center justify-between pb-3 px-2">
                  <span className="font-heading font-extrabold text-xs tracking-wider text-slate-200">
                    TDI • Demo Carrusel 3D
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FF8C00] text-white">
                    Intermedio / Avanzado
                  </span>
                </div>

                <Carousel3DViewer
                  plan="intermedio"
                  fotoPortada="https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=80"
                  fotosCarrusel={[
                    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=80'
                  ]}
                />

                <div className="pt-4 text-center">
                  <p className="text-xs text-slate-300">
                    Gira y rota en 3D para exhibir productos y catálogo
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3 Steps Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#0B2B40]">
            Cómo Funciona el Ecosistema TDI
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Una arquitectura conectada entre el frontend interactivo, Firebase y tu servidor en Render.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF8C00] flex items-center justify-center font-heading font-black text-xl mb-4">
              1
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0B2B40] mb-2">
              Sube tu Logo y Fotos
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              En el formulario, cuentas con un botón específico para subir tu logo o foto de portada. En planes pagos puedes añadir hasta 12 fotos para el Carrusel 3D.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#0B2B40] flex items-center justify-center font-heading font-black text-xl mb-4">
              2
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0B2B40] mb-2">
              Emisión en Render
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              La app se conecta al endpoint <code className="font-mono text-[11px] bg-slate-100 px-1 py-0.5 rounded">/api/generar-tarjeta</code> en tu servidor Render y te entrega un enlace único público.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-[#0B2B40]/10 text-[#0B2B40] flex items-center justify-center font-heading font-black text-xl mb-4">
              3
            </div>
            <h3 className="font-heading font-bold text-lg text-[#0B2B40] mb-2">
              PULPO 🐙 Responde en /chat
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              El agente ya programado en el servidor atiende consultas de tus prospectos 24/7 con personalidad empática y memoria conversacional.
            </p>
          </div>

        </div>
      </section>

      {/* Plans Preview Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-[#0B2B40] via-[#071A27] to-[#0B2B40] p-8 sm:p-12 text-white border border-[#FBBF24]/30 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF8C00] text-white">
              Precios Transparentes
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
              Comienza desde $25.000 COP al año
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm">
              Disfruta del Plan Básico con portada o desbloquea el Carrusel 3D y a Pulpo con nuestros planes Intermedio, Avanzado y Premium.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => onSelectTab('plans')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] font-bold text-sm shadow hover:brightness-105 transition-all"
            >
              Explorar los 4 Planes
            </button>
            <button
              onClick={() => onSelectTab('create')}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Crear Directamente
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
