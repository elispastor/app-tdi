import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Firestore,
  serverTimestamp
} from 'firebase/firestore';
import { TdiCard, UserProfile, PlanType } from '../types';
import firebaseConfigJson from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigJson.apiKey,
  authDomain: firebaseConfigJson.authDomain,
  projectId: firebaseConfigJson.projectId,
  storageBucket: firebaseConfigJson.storageBucket,
  messagingSenderId: firebaseConfigJson.messagingSenderId,
  appId: firebaseConfigJson.appId,
};

// Initialize Firebase safely
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const auth: Auth = getAuth(app);

// Use specified firestoreDatabaseId if present
export const db: Firestore = firebaseConfigJson.firestoreDatabaseId && firebaseConfigJson.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfigJson.firestoreDatabaseId)
  : getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // ensure user record in firestore
    await ensureUserInDb(result.user);
    return result.user;
  } catch (error: any) {
    // If popup blocked or failed in iframe, fallback to anonymous sign in
    console.warn('Google sign-in popup error, falling back to guest/anonymous:', error);
    const anonResult = await signInAnonymously(auth);
    await ensureUserInDb(anonResult.user, 'Usuario Invitado');
    return anonResult.user;
  }
}

export async function loginAsGuest(name: string = 'Emprendedor TDI'): Promise<User> {
  const anonResult = await signInAnonymously(auth);
  await ensureUserInDb(anonResult.user, name);
  return anonResult.user;
}

export async function logout(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function ensureUserInDb(user: User, customName?: string): Promise<UserProfile> {
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || customName || 'Usuario TDI',
      plan: 'intermedio', // Default starter plan
      photoURL: user.photoURL || null,
      createdAt: Date.now()
    };
    await setDoc(userRef, newProfile);
    return newProfile;
  } catch (err) {
    console.error('Error saving user to DB:', err);
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || customName || 'Usuario TDI',
      plan: 'intermedio',
      createdAt: Date.now()
    };
  }
}

export async function updateUserPlan(uid: string, plan: PlanType): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { plan }, { merge: true });
  } catch (err) {
    console.error('Error updating user plan:', err);
  }
}

export async function saveCardToDb(card: TdiCard): Promise<void> {
  try {
    const cardRef = doc(db, 'cards', card.id);
    await setDoc(cardRef, {
      ...card,
      updatedAt: serverTimestamp()
    });
  } catch (err) {
    console.error('Error saving card to firestore:', err);
    // Local backup in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('tdi_local_cards') || '[]');
      const filtered = existing.filter((c: TdiCard) => c.id !== card.id);
      localStorage.setItem('tdi_local_cards', JSON.stringify([card, ...filtered]));
    } catch (e) {
      console.error('Error in local backup:', e);
    }
  }
}

export async function getUserCardsFromDb(userId: string): Promise<TdiCard[]> {
  try {
    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, where('userId', '==', userId));
    const snap = await getDocs(q);
    const cards: TdiCard[] = [];
    snap.forEach((docSnap) => {
      cards.push(docSnap.data() as TdiCard);
    });
    // Combine with local storage if any
    const localCards: TdiCard[] = JSON.parse(localStorage.getItem('tdi_local_cards') || '[]');
    const userLocal = localCards.filter(c => c.userId === userId);
    
    // Merge by id
    const map = new Map<string, TdiCard>();
    cards.forEach(c => map.set(c.id, c));
    userLocal.forEach(c => map.set(c.id, c));
    return Array.from(map.values()).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) {
    console.warn('Could not fetch from Firestore, reading local fallback:', err);
    const localCards: TdiCard[] = JSON.parse(localStorage.getItem('tdi_local_cards') || '[]');
    return localCards.filter(c => !userId || c.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
  }
}
