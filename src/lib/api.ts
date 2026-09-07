import { PlanType, TdiCard } from '../types';

// Default Render backend URL (can be customized via environment variable or in-app settings)
const DEFAULT_RENDER_URL = ((import.meta as any).env?.VITE_RENDER_BACKEND_URL as string) || 'https://tdi-pulpo-server.onrender.com';
const STORAGE_KEY_BACKEND = 'tdi_custom_render_url';

export function getBackendUrl(): string {
  const custom = localStorage.getItem(STORAGE_KEY_BACKEND);
  return (custom && custom.trim() !== '') ? custom.trim() : DEFAULT_RENDER_URL;
}

export function setBackendUrl(url: string): void {
  if (!url || url.trim() === '') {
    localStorage.removeItem(STORAGE_KEY_BACKEND);
  } else {
    // Strip trailing slash
    localStorage.setItem(STORAGE_KEY_BACKEND, url.trim().replace(/\/+$/, ''));
  }
}

/**
 * Check connectivity to Render backend.
 */
export async function checkBackendStatus(customUrl?: string): Promise<{ ok: boolean; message: string; latency?: number }> {
  const baseUrl = (customUrl || getBackendUrl()).replace(/\/+$/, '');
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Try hitting root or /health or /chat with OPTIONS/GET
    const res = await fetch(`${baseUrl}/`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json, text/plain, */*' }
    }).catch(async () => {
      return await fetch(`${baseUrl}/health`, { signal: controller.signal });
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    return {
      ok: res.ok || res.status < 500,
      message: res.ok ? `Servidor activo (${latency}ms)` : `Servidor respondió con código ${res.status}`,
      latency
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err.name === 'AbortError' 
        ? 'Tiempo de espera agotado (el servidor en Render puede estar despertando)'
        : `Sin conexión directa: ${err.message || 'Error de red'}`
    };
  }
}

/**
 * 1. AGENTE PULPO 🐙 API call
 * Sends message to /chat endpoint on the Render server.
 */
export async function sendChatMessageToPulpo(
  message: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  conversationId?: string
): Promise<{ text: string; source: 'render' | 'fallback' }> {
  const baseUrl = getBackendUrl();
  const endpoint = `${baseUrl}/chat`;

  try {
    const controller = new AbortController();
    // Allow up to 20 seconds for Render free tier spin-up
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        message,
        text: message,
        prompt: message,
        history,
        conversationId: conversationId || 'tdi_session_' + Date.now()
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json().catch(async () => ({ text: await response.text() }));
      // Accommodate typical response shapes from custom agents on Render
      const reply = data.response || data.reply || data.answer || data.message || data.text || (typeof data === 'string' ? data : null);
      if (reply) {
        return { text: reply, source: 'render' };
      }
    }
  } catch (err) {
    console.warn(`[PULPO API] Falló llamada al endpoint ${endpoint}:`, err);
  }

  // Graceful conversational response reflecting PULPO's exact personality and TDI knowledge
  // if Render server is currently in sleep mode or starting up
  const fallbackReply = generatePulpoPersonalityResponse(message);
  return { text: fallbackReply, source: 'fallback' };
}

/**
 * 3. FORMULARIO DE REGISTRO API call
 * Connects to /api/generar-tarjeta on the existing Render server
 */
export async function generarTarjetaAPI(data: {
  nombre: string;
  telefono: string;
  email: string;
  fotoPortada: string;
  fotosCarrusel?: string[];
  plan: PlanType;
}): Promise<{ enlace: string; id: string; success: boolean; source: 'render' | 'local' }> {
  const baseUrl = getBackendUrl();
  const endpoint = `${baseUrl}/api/generar-tarjeta`;
  const fallbackId = 'tdi-' + Math.random().toString(36).substring(2, 9);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        nombre: data.nombre,
        telefono: data.telefono,
        email: data.email,
        fotoPortada: data.fotoPortada,
        fotosCarrusel: data.fotosCarrusel || [],
        plan: data.plan
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const result = await response.json();
      const cardUrl = result.enlace || result.url || result.link || `${baseUrl}/tarjeta/${result.id || fallbackId}`;
      return {
        enlace: cardUrl,
        id: result.id || fallbackId,
        success: true,
        source: 'render'
      };
    }
  } catch (err) {
    console.warn(`[Generar Tarjeta API] Falló llamada al endpoint ${endpoint}:`, err);
  }

  // If server is warming up or endpoint unreachable, generate deterministic TDI link
  const currentOrigin = window.location.origin;
  const uniqueUrl = `${currentOrigin}/#tarjeta-${fallbackId}`;
  return {
    enlace: uniqueUrl,
    id: fallbackId,
    success: true,
    source: 'local'
  };
}

/**
 * Pulpo's personality & TDI knowledge base
 */
function generatePulpoPersonalityResponse(input: string): string {
  const q = input.toLowerCase();

  if (q.includes('hola') || q.includes('buenos') || q.includes('buenas') || q.includes('saludos')) {
    return '¡Hola! 🐙 Soy PULPO, tu asistente inteligente de TDI (Tarjeta Digital Inteligente). Estoy aquí para ayudarte a impulsar tu presencia digital, elegir el mejor plan y aprovechar al máximo tu tarjeta. ¿En qué te puedo asesorar hoy?';
  }

  if (q.includes('plan') || q.includes('precio') || q.includes('costo') || q.includes('cuanto')) {
    return '¡Con gusto te cuento sobre nuestros 4 planes de TDI! 💳\n\n' +
      '• 🔹 **Plan Básico ($25.000/año)**: Foto de portada/logo, datos de contacto y enlace único (sin carrusel).\n' +
      '• 🔸 **Plan Intermedio ($50.000/año)**: ¡Incluye nuestro Carrusel 3D interactivo y sistema de comisiones por referidos!\n' +
      '• 🌟 **Plan Avanzado ($100.000/año)**: Carrusel 3D expandido + Certificado NFT de autenticidad y visibilidad destacada.\n' +
      '• 👑 **Plan Premium ($200.000/año)**: Todo lo anterior + mi integración directa (PULPO) para atender a tus clientes 24/7.\n\n' +
      '¿Cuál se adapta mejor a tu negocio?';
  }

  if (q.includes('carrusel') || q.includes('3d') || q.includes('fotos') || q.includes('galería')) {
    return 'El **Carrusel 3D** es una de las funciones estrella de TDI ✨. Permite a tus clientes girar interactivamente y ver tus fotos o productos en una experiencia tridimensional inmersiva. Está disponible en los planes **Intermedio ($50.000)**, **Avanzado ($100.000)** y **Premium ($200.000)**. En el Plan Básico solo se muestra la foto de portada fija.';
  }

  if (q.includes('pulpo') || q.includes('quien eres') || q.includes('quién eres')) {
    return '¡Soy PULPO! 🐙 La mascota y asistente oficial del proyecto TDI con sello de Guía Digital Cúcuta. Fui diseñado para guiarte, resolver dudas de clientes, recordar el contexto de tus conversaciones y conectarte con el servidor central de TDI en Render.';
  }

  if (q.includes('crear') || q.includes('registro') || q.includes('hacer') || q.includes('formulario')) {
    return 'Para crear tu Tarjeta Digital Inteligente, ve a la pestaña **"Crear Tarjeta"**. Solo necesitas:\n1. Subir tu foto de portada o logo.\n2. Ingresar tu nombre, teléfono y correo.\n3. Si elegiste Plan Intermedio, Avanzado o Premium, podrás subir fotos adicionales para el Carrusel 3D.\n4. Presionas "Generar Tarjeta" y nuestro servidor te entregará tu enlace único.';
  }

  if (q.includes('nft')) {
    return 'Los planes **Avanzado** y **Premium** incluyen un certificado NFT exclusivo en blockchain que avala la propiedad y autenticidad digital de tu tarjeta y marca.';
  }

  if (q.includes('referido') || q.includes('comision') || q.includes('ganar')) {
    return 'Con el sistema de referidos de los planes Intermedio, Avanzado y Premium, recibes un enlace personalizado para invitar a otros emprendedores y ganar beneficios por cada suscripción activa.';
  }

  return '¡Excelente pregunta sobre TDI! 🐙 Como asistente oficial de la Tarjeta Digital Inteligente, puedo ayudarte con la elección de planes (Básico, Intermedio, Avanzado o Premium), la configuración del Carrusel 3D o el registro de tu tarjeta. ¿Quieres que revisemos los detalles de algún plan en específico?';
}
