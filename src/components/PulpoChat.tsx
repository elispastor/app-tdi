import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessageToPulpo, getBackendUrl } from '../lib/api';
import { ChatMessage } from '../types';
import { Send, Sparkles, Bot, Trash2, RefreshCw, AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';

interface PulpoChatProps {
  onNavigateToPlan?: () => void;
  onNavigateToCreate?: () => void;
}

export const PulpoChat: React.FC<PulpoChatProps> = ({
  onNavigateToPlan,
  onNavigateToCreate
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('tdi_pulpo_chat_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: '¡Hola! 🐙 Soy **PULPO**, tu asistente inteligente oficial del proyecto **TDI (Tarjeta Digital Inteligente)** con el respaldo de Guía Digital Cúcuta. Estoy conectado al servidor central para ayudarte a resolver cualquier duda sobre los planes, el carrusel 3D o el registro de tu tarjeta. ¿En qué te puedo colaborar hoy?',
        timestamp: Date.now()
      }
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverSource, setServerSource] = useState<'render' | 'fallback' | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const backendUrl = getBackendUrl();

  useEffect(() => {
    localStorage.setItem('tdi_pulpo_chat_history', JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    const userMsg: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: messageContent,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build conversation history for context memory
      const history = messages.slice(-8).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      // Call existing Render /chat endpoint
      const result = await sendChatMessageToPulpo(messageContent, history);
      setServerSource(result.source);

      const botMsg: ChatMessage = {
        id: 'bot_' + Date.now(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now()
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error calling /chat endpoint:', err);
      const errorMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: 'Hubo una dificultad de red al contactar al servidor en Render. Por favor verifica la conexión en configuración.',
        timestamp: Date.now(),
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('¿Deseas reiniciar la conversación con Pulpo?')) {
      const initial: ChatMessage[] = [
        {
          id: 'welcome_reset',
          role: 'assistant',
          content: '¡Conversación reiniciada! 🐙 ¿En qué más te puedo ayudar hoy con tu Tarjeta Digital Inteligente?',
          timestamp: Date.now()
        }
      ];
      setMessages(initial);
      localStorage.removeItem('tdi_pulpo_chat_history');
    }
  };

  const quickPrompts = [
    '¿Cuáles son las diferencias entre los 4 planes?',
    '¿Cómo funciona el Carrusel 3D en planes pagos?',
    '¿Qué incluye el Plan Premium con Pulpo?',
    '¿Cómo registro y subo el logo de mi tarjeta?'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Pulpo Chat Card Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[750px]">
        
        {/* Header with Pulpo mascot badge */}
        <div className="bg-gradient-to-r from-[#0B2B40] via-[#071A27] to-[#0B2B40] p-4 sm:p-6 border-b border-[#FBBF24]/30 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mascot Avatar */}
            <div className="relative">
              <img
                src="/pulpo-avatar.jpg"
                alt="Pulpo Mascota"
                className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF8C00] shadow-md shadow-[#FF8C00]/30"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0B2B40]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-extrabold text-xl text-white">
                  AGENTE PULPO 🐙
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FBBF24] text-[#0B2B40] uppercase tracking-wider">
                  Oficial Render
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-[#FF8C00]">Endpoint /chat:</span>
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
                  {backendUrl}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleClearHistory}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
              title="Limpiar chat"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Server status info strip */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-xs flex items-center justify-between text-slate-600">
          <div className="flex items-center gap-2">
            <Bot className="w-3.5 h-3.5 text-[#FF8C00]" />
            <span>Memoria de conversación y conocimiento TDI activo</span>
          </div>
          {serverSource && (
            <span className="text-[11px] font-medium text-slate-500">
              Respuesta: <strong className="text-[#0B2B40]">{serverSource === 'render' ? 'Servidor Render ⚡' : 'Asistente TDI 🐙'}</strong>
            </span>
          )}
        </div>

        {/* Message Feed Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl overflow-hidden border border-[#FF8C00] shadow-sm bg-[#0B2B40]">
                    <img
                      src="/pulpo-avatar.jpg"
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-[#FF8C00] to-[#FF8C00]/90 text-white rounded-tr-none'
                      : msg.isError
                      ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Markdown or plain formatted text */}
                  <div className="whitespace-pre-wrap">
                    {msg.content}
                  </div>

                  <div className={`text-[10px] mt-2 font-mono flex items-center justify-end gap-1 ${
                    isUser ? 'text-orange-100' : 'text-slate-400'
                  }`}>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl overflow-hidden border border-[#FF8C00] bg-[#0B2B40]">
                <img src="/pulpo-avatar.jpg" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FF8C00] animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-[#FBBF24] animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-[#0B2B40] animate-bounce [animation-delay:0.4s]" />
                <span className="text-xs text-slate-500 ml-1 font-medium">Pulpo está escribiendo...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FF8C00]" /> Sugerencias:
          </span>
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1 rounded-full bg-slate-100 hover:bg-[#FF8C00]/10 hover:text-[#FF8C00] hover:border-[#FF8C00]/30 border border-slate-200 text-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Input Box */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregúntale a PULPO sobre planes, carrusel 3D o tu tarjeta..."
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF8C00] focus:border-transparent transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] text-[#0B2B40] font-bold text-sm shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <span>Enviar</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
