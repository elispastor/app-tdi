import React, { useState } from 'react';
import { getBackendUrl, setBackendUrl, checkBackendStatus } from '../lib/api';
import { X, Server, CheckCircle2, AlertTriangle, RefreshCw, Globe, Sparkles } from 'lucide-react';

interface BackendSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChanged: (isOnline: boolean) => void;
}

export const BackendSettingsModal: React.FC<BackendSettingsModalProps> = ({
  isOpen,
  onClose,
  onStatusChanged
}) => {
  const [url, setUrl] = useState(getBackendUrl());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; latency?: number } | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await checkBackendStatus(url);
    setTestResult(result);
    setTesting(false);
    onStatusChanged(result.ok);
  };

  const handleSave = () => {
    setBackendUrl(url);
    onClose();
  };

  const handleReset = () => {
    const defaultUrl = ((import.meta as any).env?.VITE_RENDER_BACKEND_URL as string) || 'https://tdi-pulpo-server.onrender.com';
    setUrl(defaultUrl);
    setBackendUrl('');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0B2B40] text-[#FBBF24] flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-[#0B2B40]">
                Configuración del Servidor Render
              </h3>
              <p className="text-xs text-slate-500">
                Integración de endpoints TDI (Pulpo, Carrusel 3D y Generador)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-5 space-y-2">
          <div className="font-bold text-[#0B2B40] flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#FF8C00]" /> Endpoints configurados en tu servidor Render:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-[11px] ml-1">
            <li><strong>/chat</strong>: Conecta directamente con el Agente PULPO 🐙</li>
            <li><strong>/api/generar-tarjeta</strong>: Procesa el registro y emite el enlace único</li>
            <li><strong>Carrusel 3D</strong>: Renderizado para planes Intermedio, Avanzado y Premium</li>
          </ul>
        </div>

        {/* Input for Render URL */}
        <div className="space-y-2 mb-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            URL Base de tu servicio en Render
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://tu-servicio-tdi.onrender.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent"
          />
          <p className="text-[11px] text-slate-400">
            * En Render Free Tier el servidor puede tardar unos 30-50 segundos en despertar si estaba inactivo.
          </p>
        </div>

        {/* Test Result box */}
        {testResult && (
          <div className={`p-3.5 rounded-xl text-xs mb-4 flex items-center gap-2 border ${
            testResult.ok 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {testResult.ok ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            )}
            <div>
              <p className="font-semibold">{testResult.message}</p>
              {!testResult.ok && (
                <p className="text-[10px] text-amber-700 mt-0.5">
                  La app usará los endpoints directos con reintentos y asistente Pulpo de contingencia mientras el contenedor de Render se activa.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleTest}
            disabled={testing}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>{testing ? 'Probando...' : 'Probar Conexión'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              Restablecer
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] font-bold text-xs shadow hover:brightness-105 transition-all"
            >
              Guardar Cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
