import { PlanConfig, PlanType } from '../types';

export const PLANS: Record<PlanType, PlanConfig> = {
  basico: {
    id: 'basico',
    name: 'Plan Básico',
    priceCOP: 25000,
    period: '/año',
    hasCarousel: false,
    hasReferrals: false,
    hasNFT: false,
    hasPulpo: false,
    featuredVisibility: false,
    maxCarouselImages: 0,
    description: 'La presencia digital esencial para iniciar tu negocio con tarjeta inteligente.',
    features: [
      'Tarjeta Digital Inteligente (TDI)',
      'Foto de portada / Logo personalizado',
      'Información de contacto directa (Teléfono, Email)',
      'Enlace único compartible en redes y WhatsApp',
      'Código QR dinámico',
      'Sin carrusel 3D'
    ]
  },
  intermedio: {
    id: 'intermedio',
    name: 'Plan Intermedio',
    priceCOP: 50000,
    period: '/año',
    hasCarousel: true,
    hasReferrals: true,
    hasNFT: false,
    hasPulpo: false,
    featuredVisibility: false,
    badgeText: 'Popular',
    maxCarouselImages: 4,
    description: 'Impacta visualmente con Carrusel 3D interactivo y sistema de referidos.',
    features: [
      'Todo lo del Plan Básico',
      '✨ Carrusel 3D Interactivo de fotos/productos (hasta 4)',
      'Sistema de referidos para generar comisiones',
      'Estadísticas de visualización',
      'Acceso a soporte técnico prioritario'
    ]
  },
  avanzado: {
    id: 'avanzado',
    name: 'Plan Avanzado',
    priceCOP: 100000,
    period: '/año',
    hasCarousel: true,
    hasReferrals: true,
    hasNFT: true,
    hasPulpo: false,
    featuredVisibility: true,
    badgeText: 'Recomendado',
    maxCarouselImages: 8,
    description: 'Para negocios y marcas que buscan máxima visibilidad, NFT de autenticidad y carrusel 3D expandido.',
    features: [
      'Todo lo del Plan Intermedio',
      '✨ Carrusel 3D Avanzado (hasta 8 fotos/productos)',
      'NFT de autenticidad digital en blockchain',
      'Visibilidad destacada en el directorio TDI',
      'Botones de llamado a la acción personalizados',
      'Integración con catálogo comercial'
    ]
  },
  premium: {
    id: 'premium',
    name: 'Plan Premium',
    priceCOP: 200000,
    period: '/año',
    hasCarousel: true,
    hasReferrals: true,
    hasNFT: true,
    hasPulpo: true,
    featuredVisibility: true,
    badgeText: 'VIP & IA',
    maxCarouselImages: 12,
    description: 'La suite completa con Carrusel 3D ilimitado y el AGENTE PULPO 🐙 integrado para atender a tus clientes 24/7.',
    features: [
      'Todo lo del Plan Avanzado',
      '🐙 AGENTE PULPO con IA incluido para tu tarjeta',
      'Atención automatizada 24/7 para tus prospectos',
      'Carrusel 3D Premium (hasta 12 fotos)',
      'NFT Coleccionable exclusivo TDI VIP',
      'Posicionamiento Top en Guía Digital Cúcuta',
      'Soporte VIP 1 a 1 dedicado'
    ]
  }
};

export const formatCOP = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(amount);
};
