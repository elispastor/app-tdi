import React, { useState, useRef } from 'react';
import { PlanType, TdiCard } from '../types';
import { PLANS } from '../data/plans';
import { Carousel3DViewer } from './Carousel3DViewer';
import { generarTarjetaAPI } from '../lib/api';
import { saveCardToDb } from '../lib/firebase';
import { User } from 'firebase/auth';
import { 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Copy, 
  ExternalLink, 
  Share2, 
  QrCode, 
  AlertCircle,
  Phone,
  Mail,
  User as UserIcon,
  HelpCircle
} from 'lucide-react';

interface CardFormProps {
  selectedPlan: PlanType;
  onSelectPlan: (plan: PlanType) => void;
  user: User | null;
  onCardCreated?: (card: TdiCard) => void;
  onOpenPulpoChat?: () => void;
}

export const CardForm: React.FC<CardFormProps> = ({
  selectedPlan,
  onSelectPlan,
  user,
  onCardCreated,
  onOpenPulpoChat
}) => {
  const planInfo = PLANS[selectedPlan];
  const isPaid = selectedPlan !== 'basico';

  // Form State
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [fotoPortada, setFotoPortada] = useState<string>('');
  const [fotosCarrusel, setFotosCarrusel] = useState<string[]>([]);

  // UI & Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [generatedCard, setGeneratedCard] = useState<TdiCard | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const carruselInputRef = useRef<HTMLInputElement>(null);

  // Handle Logo / Cover upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setFormError('La imagen del logo no debe superar los 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFotoPortada(event.target.result);
        setFormError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Carousel images upload
  const handleCarouselUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = planInfo.maxCarouselImages - fotosCarrusel.length;
    if (remainingSlots <= 0) {
      setFormError(`Has alcanzado el límite de ${planInfo.maxCarouselImages} fotos para el ${planInfo.name}`);
      return;
    }

    const filesToProcess: File[] = Array.from(files).slice(0, remainingSlots) as File[];
    filesToProcess.forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          setFotosCarrusel((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveCarouselPhoto = (index: number) => {
    setFotosCarrusel((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!nombre.trim()) {
      setFormError('Por favor ingresa el nombre de la persona o negocio');
      return;
    }
    if (!telefono.trim()) {
      setFormError('Por favor ingresa el número de teléfono');
      return;
    }
    if (!email.trim()) {
      setFormError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (!fotoPortada) {
      setFormError('Es obligatorio subir la foto de portada / logo para tu TDI');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('Enviando datos al servidor en Render (/api/generar-tarjeta)...');

    try {
      // 1. Call the existing backend endpoint on Render
      const result = await generarTarjetaAPI({
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        fotoPortada,
        fotosCarrusel: isPaid ? fotosCarrusel : [],
        plan: selectedPlan
      });

      const newCard: TdiCard = {
        id: result.id,
        userId: user?.uid || 'anon_' + Date.now(),
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        fotoPortada,
        fotosCarrusel: isPaid ? fotosCarrusel : [],
        plan: selectedPlan,
        enlace: result.enlace,
        createdAt: Date.now(),
        activo: true
      };

      // 2. Persist in Firebase Firestore
      await saveCardToDb(newCard);

      setGeneratedCard(newCard);
      if (onCardCreated) {
        onCardCreated(newCard);
      }
    } catch (err: any) {
      console.error('Error al generar tarjeta:', err);
      setFormError('Ocurrió un error al generar la tarjeta. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
      setSubmitMessage(null);
    }
  };

  const copyToClipboard = () => {
    if (!generatedCard?.enlace) return;
    navigator.clipboard.writeText(generatedCard.enlace);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF8C00]/20 text-[#FF8C00] border border-[#FF8C00]/40">
              Paso 3 • Generador Oficial
            </span>
            <span className="text-xs text-slate-500 font-medium">Conectado a /api/generar-tarjeta</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2B40] font-heading">
            Registro y Emisión de Tarjeta Digital
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Diligencia tus datos, sube tu logo y genera tu enlace único con almacenamiento permanente en Firebase.
          </p>
        </div>

        {/* Plan Switcher Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
          {(['basico', 'intermedio', 'avanzado', 'premium'] as PlanType[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onSelectPlan(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all whitespace-nowrap ${
                selectedPlan === p
                  ? 'bg-[#0B2B40] text-[#FBBF24] shadow'
                  : 'text-slate-600 hover:text-[#0B2B40]'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form + Real-time Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form (7 cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            
            {/* Plan notice banner */}
            <div className={`p-4 rounded-xl text-xs flex items-center justify-between border ${
              isPaid
                ? 'bg-[#0B2B40]/5 border-[#FBBF24]/40 text-[#0B2B40]'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF8C00] flex-shrink-0" />
                <span>
                  <strong>{planInfo.name}</strong> activo. {isPaid ? '✨ Carrusel 3D habilitado para tus fotos.' : '⚠️ En este plan solo se muestra la foto de portada fija.'}
                </span>
              </div>
              {!isPaid && (
                <button
                  type="button"
                  onClick={() => onSelectPlan('intermedio')}
                  className="ml-2 font-bold text-[#FF8C00] underline whitespace-nowrap"
                >
                  Mejorar plan
                </button>
              )}
            </div>

            {/* ERROR ALERT */}
            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
                <span>{formError}</span>
              </div>
            )}

            {/* Basic Info Fields */}
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-base text-[#0B2B40] flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-[#FF8C00]" />
                1. Información del Titular o Empresa
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombre Completo / Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Juan Pérez o Inmobiliaria Cúcuta"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Teléfono WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+57 310 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contacto@minegocio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* REQUIREMENT #7: BOTÓN ESPECÍFICO PARA SUBIR LOGO / FOTO DE PORTADA */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="block font-heading font-bold text-base text-[#0B2B40] flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#FF8C00]" />
                  2. Foto de Portada (Logo) *
                </label>
                <span className="text-xs text-slate-500">Requerido para todos los planes</span>
              </div>
              <p className="text-xs text-slate-500 mb-3">
                Esta es la imagen de presentación principal de tu tarjeta. Sube el logo de tu empresa o tu foto profesional.
              </p>

              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                id="input-logo-portada"
              />

              {fotoPortada ? (
                <div className="relative rounded-xl border-2 border-dashed border-[#FF8C00] p-4 bg-orange-50/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={fotoPortada}
                      alt="Logo Portada"
                      className="w-16 h-16 object-contain rounded-lg bg-white p-1 border border-slate-200 shadow-sm"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#0B2B40] block">Foto de Portada cargada</span>
                      <span className="text-[11px] text-slate-500">Lista para integrarse en la tarjeta</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => logoInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={() => setFotoPortada('')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
                      title="Eliminar logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => logoInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed border-slate-300 hover:border-[#FF8C00] hover:bg-orange-50/20 p-6 text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-[#FF8C00]/10 flex items-center justify-center text-[#FF8C00] group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-[#0B2B40] block">
                    Botón para Subir Logo / Portada
                  </span>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Haz clic aquí o arrastra tu archivo (PNG, JPG o WebP)
                  </p>
                </div>
              )}
            </div>

            {/* REQUIREMENT #2 & #3: FOTOS DEL CARRUSEL (SOLO SI PLAN ES PAGO) */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <label className="font-heading font-bold text-base text-[#0B2B40] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                  3. Fotos del Carrusel 3D {isPaid ? `(Hasta ${planInfo.maxCarouselImages} fotos)` : '(No disponible en Básico)'}
                </label>
              </div>

              {isPaid ? (
                <div>
                  <p className="text-xs text-slate-500 mb-3">
                    Estas fotos rotarán en la experiencia 3D de tu tarjeta digital inteligente.
                  </p>

                  <input
                    ref={carruselInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleCarouselUpload}
                    className="hidden"
                    id="input-carrusel-fotos"
                  />

                  {/* Carousel thumbnails grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                    {fotosCarrusel.map((img, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemoveCarouselPhoto(i)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-bold bg-black/60 text-white rounded">
                          Slide {i + 1}
                        </span>
                      </div>
                    ))}

                    {/* Add more button */}
                    {fotosCarrusel.length < planInfo.maxCarouselImages && (
                      <button
                        type="button"
                        onClick={() => carruselInputRef.current?.click()}
                        className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-[#FF8C00] flex flex-col items-center justify-center p-2 text-slate-500 hover:text-[#FF8C00] transition-colors bg-slate-50 hover:bg-orange-50/20"
                      >
                        <Plus className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold text-center">Subir Foto</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {fotosCarrusel.length} de {planInfo.maxCarouselImages} fotos añadidas
                  </span>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700 mb-1">El Carrusel 3D no está incluido en el Plan Básico ($25.000/año).</p>
                  <p>
                    Tu tarjeta mostrará tu foto de portada de forma fija. Si deseas exhibir múltiples fotos o productos en 3D interactivo, te sugerimos el <button type="button" onClick={() => onSelectPlan('intermedio')} className="text-[#FF8C00] font-bold underline">Plan Intermedio</button>.
                  </p>
                </div>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-6 border-t border-slate-200">
              <button
                type="submit"
                id="btn-generar-tarjeta"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-heading font-extrabold text-base bg-gradient-to-r from-[#FF8C00] via-[#FBBF24] to-[#FF8C00] text-[#0B2B40] shadow-lg shadow-[#FF8C00]/30 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-[#0B2B40] border-t-transparent rounded-full animate-spin" />
                    <span>Conectando con Servidor Render...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 text-[#0B2B40]" />
                    <span>Generar Tarjeta Digital Inteligente</span>
                  </>
                )}
              </button>

              {submitMessage && (
                <p className="text-center text-xs text-slate-500 mt-2 animate-pulse">
                  {submitMessage}
                </p>
              )}
            </div>

          </form>
        </div>

        {/* Right Column: Live TDI Preview (5 cols) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 space-y-4">
            
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-[#0B2B40] flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                Previsualización en Vivo
              </h3>
              <span className="text-xs text-slate-400 font-mono">TDI Viewer</span>
            </div>

            {/* Realistic TDI Mobile Mockup Card */}
            <div className="relative mx-auto max-w-sm rounded-[32px] p-3 bg-gradient-to-b from-[#0B2B40] via-[#071A27] to-[#040E15] border-4 border-[#0B2B40] shadow-2xl shadow-[#0B2B40]/40 text-white">
              
              {/* Phone Speaker Notch */}
              <div className="w-24 h-4 bg-black/70 rounded-full mx-auto mb-3 flex items-center justify-center">
                <div className="w-10 h-1 bg-white/20 rounded-full" />
              </div>

              {/* Card Header */}
              <div className="px-3 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] p-0.5">
                    <div className="w-full h-full bg-[#0B2B40] rounded-[6px] flex items-center justify-center font-bold text-[10px] text-[#FBBF24]">
                      TDI
                    </div>
                  </div>
                  <span className="font-heading font-black text-xs tracking-wider">
                    {nombre || 'Mi Tarjeta Digital'}
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF8C00]/20 text-[#FF8C00] font-bold border border-[#FF8C00]/40 uppercase">
                  {selectedPlan}
                </span>
              </div>

              {/* 3D Carousel or Cover Display */}
              <div className="mb-4">
                <Carousel3DViewer
                  plan={selectedPlan}
                  fotoPortada={fotoPortada}
                  fotosCarrusel={isPaid ? fotosCarrusel : []}
                />
              </div>

              {/* Contact Information & Action Buttons */}
              <div className="px-3 space-y-3 pb-2">
                <div className="text-center">
                  <h4 className="font-heading font-extrabold text-lg text-white">
                    {nombre || 'Tu Nombre o Marca'}
                  </h4>
                  <p className="text-xs text-[#FBBF24] font-medium">
                    {telefono || '+57 300 000 0000'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {email || 'correo@ejemplo.com'}
                  </p>
                </div>

                {/* Quick Action Pills in mockup */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] text-center font-bold text-xs shadow">
                    WhatsApp
                  </div>
                  <div className="py-2 px-3 rounded-xl bg-white/10 text-white text-center font-semibold text-xs border border-white/10">
                    Guardar Contacto
                  </div>
                </div>

                {/* Pulpo integration teaser if premium */}
                {selectedPlan === 'premium' && (
                  <div 
                    onClick={onOpenPulpoChat}
                    className="cursor-pointer p-2 rounded-xl bg-[#FBBF24]/15 border border-[#FBBF24]/30 flex items-center gap-2 hover:bg-[#FBBF24]/25 transition-colors"
                  >
                    <img 
                      src="/pulpo-avatar.jpg" 
                      alt="" 
                      className="w-7 h-7 rounded-full object-cover border border-[#FF8C00]"
                      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                    <div className="text-left">
                      <span className="text-[11px] font-bold text-[#FBBF24] block">Asistente Pulpo 🐙 Activo</span>
                      <span className="text-[10px] text-slate-300">Atención 24/7 incluida en Premium</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* SUCCESS MODAL UPON CARD GENERATION */}
      {generatedCard && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-extrabold text-center text-[#0B2B40] font-heading">
              ¡Tarjeta Digital Generada con Éxito!
            </h3>
            <p className="text-center text-xs text-slate-600 mt-1">
              Conexión exitosa con el servidor Render. Tu enlace único está listo y registrado en Firebase.
            </p>

            {/* Generated Unique Link Display */}
            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Enlace Único de tu Tarjeta TDI
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedCard.enlace}
                  className="w-full bg-white px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 text-[#0B2B40] focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 px-3 py-2 rounded-lg bg-[#FF8C00] hover:bg-[#FF8C00]/90 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  {copySuccess ? 'Copiado' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Actions: Open card, WhatsApp, Close */}
            <div className="space-y-2.5">
              <a
                href={generatedCard.enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-xs bg-[#0B2B40] hover:bg-[#0B2B40]/90 text-[#FBBF24] flex items-center justify-center gap-2 transition-colors shadow"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir mi Tarjeta en Nueva Pestaña</span>
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`¡Hola! Te comparto mi nueva Tarjeta Digital Inteligente TDI: ${generatedCard.enlace}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2 transition-colors shadow"
              >
                <Share2 className="w-4 h-4" />
                <span>Compartir por WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => setGeneratedCard(null)}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-500 hover:text-slate-800 transition-colors"
              >
                Cerrar y continuar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
