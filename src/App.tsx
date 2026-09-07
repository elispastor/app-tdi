import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { PlanSelector } from './components/PlanSelector';
import { CardForm } from './components/CardForm';
import { MyCardsList } from './components/MyCardsList';
import { PulpoChat } from './components/PulpoChat';
import { BackendSettingsModal } from './components/BackendSettingsModal';
import { AuthModal } from './components/AuthModal';
import { PlanType, TdiCard, UserProfile } from './types';
import { auth, getUserCardsFromDb, logout, ensureUserInDb } from './lib/firebase';
import { checkBackendStatus } from './lib/api';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Sparkles, MessageSquare, Heart, Globe, Shield } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'home' | 'plans' | 'create' | 'cards' | 'chat'>('home');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('intermedio');
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [cards, setCards] = useState<TdiCard[]>([]);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Monitor Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userProf = await ensureUserInDb(currentUser);
        setProfile(userProf);
        const userCards = await getUserCardsFromDb(currentUser.uid);
        setCards(userCards);
      } else {
        setProfile(null);
        // Load cards from local storage if anonymous
        const localCards = await getUserCardsFromDb('');
        setCards(localCards);
      }
    });
    return () => unsubscribe();
  }, []);

  // Check Backend connectivity initially
  useEffect(() => {
    checkBackendStatus().then((res) => {
      setIsBackendOnline(res.ok);
    });
  }, []);

  const handleCardCreated = (newCard: TdiCard) => {
    setCards((prev) => [newCard, ...prev.filter((c) => c.id !== newCard.id)]);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0B2B40] selection:bg-[#FF8C00] selection:text-white">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        user={user}
        profile={profile}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isBackendOnline={isBackendOnline}
      />

      {/* Main Content Area based on selected Tab */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomeHero
            onSelectTab={setCurrentTab}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setCurrentTab('create');
            }}
          />
        )}

        {currentTab === 'plans' && (
          <div className="max-w-7xl mx-auto px-4 py-6">
            <PlanSelector
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onProceedToForm={(plan) => {
                setSelectedPlan(plan);
                setCurrentTab('create');
              }}
            />
          </div>
        )}

        {currentTab === 'create' && (
          <CardForm
            selectedPlan={selectedPlan}
            onSelectPlan={setSelectedPlan}
            user={user}
            onCardCreated={handleCardCreated}
            onOpenPulpoChat={() => setCurrentTab('chat')}
          />
        )}

        {currentTab === 'cards' && (
          <MyCardsList
            cards={cards}
            onNavigateToCreate={() => setCurrentTab('create')}
            onSelectPlan={(plan) => {
              setSelectedPlan(plan);
              setCurrentTab('create');
            }}
          />
        )}

        {currentTab === 'chat' && (
          <PulpoChat
            onNavigateToPlan={() => setCurrentTab('plans')}
            onNavigateToCreate={() => setCurrentTab('create')}
          />
        )}
      </main>

      {/* Floating Pulpo Quick Action Bubble (if not currently in chat) */}
      {currentTab !== 'chat' && (
        <button
          onClick={() => setCurrentTab('chat')}
          id="btn-floating-pulpo"
          title="Hablar con Pulpo IA"
          className="fixed bottom-6 right-6 z-40 p-2.5 sm:px-4 sm:py-3 rounded-2xl bg-[#0B2B40] text-white border-2 border-[#FBBF24] shadow-2xl shadow-[#0B2B40]/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
        >
          <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-[#FF8C00]">
            <img
              src="/pulpo-avatar.jpg"
              alt="Pulpo"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-[10px] text-[#FBBF24] font-bold block uppercase tracking-wider">
              Asistente TDI
            </span>
            <span className="text-xs font-extrabold text-white flex items-center gap-1">
              Pulpo IA 🐙
            </span>
          </div>
        </button>
      )}

      {/* Footer */}
      <footer className="bg-[#0B2B40] text-slate-400 text-xs py-10 border-t border-[#FBBF24]/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#FF8C00] to-[#FBBF24] p-0.5">
                <div className="w-full h-full bg-[#0B2B40] rounded-[6px] flex items-center justify-center font-bold text-xs text-[#FBBF24]">
                  TDI
                </div>
              </div>
              <div>
                <span className="font-heading font-extrabold text-sm text-white block">
                  TDI • Tarjeta Digital Inteligente
                </span>
                <span className="text-[11px] text-slate-400">
                  Impulsado por Guía Digital Cúcuta y Servidor en Render
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-300">
              <button onClick={() => setCurrentTab('plans')} className="hover:text-[#FBBF24]">
                Planes y Precios
              </button>
              <button onClick={() => setCurrentTab('create')} className="hover:text-[#FF8C00]">
                Generar Tarjeta
              </button>
              <button onClick={() => setCurrentTab('chat')} className="hover:text-[#FBBF24] flex items-center gap-1">
                <span>Pulpo 🐙</span>
              </button>
              <button onClick={() => setIsSettingsOpen(true)} className="hover:text-white">
                Servidor Render
              </button>
            </div>

            <div className="text-center md:text-right text-[11px] text-slate-400">
              <span>Tecnología Firebase + Render Starter Tier</span>
            </div>

          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <BackendSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onStatusChanged={setIsBackendOnline}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
        }}
      />
    </div>
  );
}
