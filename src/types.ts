export type PlanType = 'basico' | 'intermedio' | 'avanzado' | 'premium';

export interface PlanConfig {
  id: PlanType;
  name: string;
  priceCOP: number;
  period: string;
  hasCarousel: boolean;
  hasReferrals: boolean;
  hasNFT: boolean;
  hasPulpo: boolean;
  featuredVisibility: boolean;
  badgeText?: string;
  description: string;
  features: string[];
  maxCarouselImages: number;
}

export interface TdiCard {
  id: string;
  userId?: string;
  nombre: string;
  telefono: string;
  email: string;
  fotoPortada: string; // Base64 data URL or remote URL (logo)
  fotosCarrusel?: string[]; // Array of image URLs or base64 for planes pagos
  plan: PlanType;
  enlace: string;
  createdAt: number;
  activo: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  isError?: boolean;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  plan: PlanType;
  photoURL?: string | null;
  createdAt: number;
}

export interface BackendStatus {
  url: string;
  isOnline: boolean;
  latencyMs?: number;
  lastChecked?: number;
  error?: string;
}
