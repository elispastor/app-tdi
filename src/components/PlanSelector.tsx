import React from 'react';
import { PlanType } from '../types';
import { PLANS, formatCOP } from '../data/plans';
import { Check, Sparkles, Crown, Zap, Shield, ArrowRight } from 'lucide-react';

interface PlanSelectorProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  onProceedToForm?: (plan: PlanType) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  selectedPlan,
  onSelectPlan,
  onProceedToForm
}) => {
  const planKeys: PlanType[] = ['basico', 'intermedio', 'avanzado', 'premium'];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FF8C00]/15 text-[#FF8C00] border border-[#FF8C00]/30 mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Planes y Segmentación Oficial TDI
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2B40] tracking-tight font-heading">
          Elige el nivel para tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C00] to-[#FBBF24]">Tarjeta Digital Inteligente</span>
        </h2>
        <p className="mt-3 text-slate-600 text-base max-w-2xl mx-auto">
          Desde la presencia esencial hasta la integración total con Carrusel 3D interactivo y el Asistente Pulpo IA.
        </p>
      </div>

      {/* Grid of 4 Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {planKeys.map((key) => {
          const plan = PLANS[key];
          const isSelected = selectedPlan === key;
          const isPremium = key === 'premium';
          const isAvanzado = key === 'avanzado';
          const isIntermedio = key === 'intermedio';

          return (
            <div
              key={key}
              id={`plan-card-${key}`}
              onClick={() => onSelectPlan(key)}
              className={`relative rounded-2xl flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden p-6 ${
                isSelected
                  ? 'bg-gradient-to-b from-[#0B2B40] to-[#071A27] text-white ring-2 ring-[#FF8C00] shadow-2xl scale-[1.02]'
                  : isPremium
                  ? 'bg-gradient-to-b from-slate-900 to-[#0B2B40] text-white border border-[#FBBF24]/40 hover:border-[#FBBF24]'
                  : 'bg-white text-slate-800 border border-slate-200 hover:border-[#FF8C00]/50 hover:shadow-xl'
              }`}
            >
              {/* Top Badges */}
              {plan.badgeText && (
                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    isPremium 
                      ? 'bg-gradient-to-r from-[#FBBF24] to-[#FF8C00] text-[#0B2B40] shadow-md shadow-[#FF8C00]/30'
                      : isSelected
                      ? 'bg-[#FF8C00] text-white'
                      : 'bg-[#0B2B40] text-[#FBBF24]'
                  }`}>
                    {plan.badgeText}
                  </span>
                </div>
              )}

              <div>
                {/* Plan Title & Icon */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                    isSelected || isPremium
                      ? 'bg-white/10 text-[#FBBF24]'
                      : 'bg-[#0B2B40]/5 text-[#0B2B40]'
                  }`}>
                    {key === 'premium' && <Crown className="w-5 h-5 text-[#FBBF24]" />}
                    {key === 'avanzado' && <Zap className="w-5 h-5 text-[#FF8C00]" />}
                    {key === 'intermedio' && <Sparkles className="w-5 h-5 text-[#FBBF24]" />}
                    {key === 'basico' && <Shield className="w-5 h-5 text-slate-500" />}
                  </div>
                  <h3 className={`font-heading font-bold text-xl ${
                    isSelected || isPremium ? 'text-white' : 'text-[#0B2B40]'
                  }`}>
                    {plan.name}
                  </h3>
                </div>

                <p className={`text-xs min-h-[36px] line-clamp-2 mb-4 ${
                  isSelected || isPremium ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  {plan.description}
                </p>

                {/* Pricing Display */}
                <div className="mb-6 pb-5 border-b border-white/10">
                  <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-extrabold font-heading ${
                      isSelected || isPremium 
                        ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FBBF24] to-[#FF8C00]'
                        : 'text-[#0B2B40]'
                    }`}>
                      {formatCOP(plan.priceCOP)}
                    </span>
                    <span className={`text-xs font-semibold ${
                      isSelected || isPremium ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {plan.period}
                    </span>
                  </div>
                  {key === 'basico' && (
                    <span className="inline-block text-[11px] font-medium text-slate-400 mt-1">
                      Solo foto de portada fija
                    </span>
                  )}
                  {key !== 'basico' && (
                    <span className="inline-block text-[11px] font-semibold text-[#FBBF24] mt-1">
                      ✨ Incluye Carrusel 3D
                    </span>
                  )}
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-2.5 mb-6 text-xs">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${
                        feat.includes('Sin carrusel') 
                          ? 'text-slate-400 bg-slate-200/20'
                          : isSelected || isPremium
                          ? 'text-[#FBBF24] bg-[#FBBF24]/20'
                          : 'text-[#FF8C00] bg-[#FF8C00]/10'
                      }`}>
                        <Check className="w-3 h-3" />
                      </div>
                      <span className={
                        feat.includes('Sin carrusel') 
                          ? 'text-slate-400 line-through' 
                          : isSelected || isPremium 
                          ? 'text-slate-200' 
                          : 'text-slate-700'
                      }>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlan(key);
                    if (onProceedToForm) onProceedToForm(key);
                  }}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] shadow-lg shadow-[#FF8C00]/30 hover:brightness-105'
                      : isPremium
                      ? 'bg-gradient-to-r from-[#FBBF24] to-[#FF8C00] text-[#0B2B40] hover:brightness-110'
                      : 'bg-[#0B2B40] text-white hover:bg-[#0B2B40]/90'
                  }`}
                >
                  <span>{isSelected ? 'Plan Seleccionado' : 'Elegir Plan'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Summary Note */}
      <div className="mt-8 text-center text-xs text-slate-500">
        Todos los planes incluyen URL pública con Starter Tier y almacenamiento seguro en Firebase.
      </div>
    </div>
  );
};
