import { useState, useEffect } from 'react';
import { type User, onAuthStateChanged, signOut } from 'firebase/auth';
import { guestAuth } from '../config/firebase-guest';

export interface GuestUser {
  uid: string;
  email: string;
  displayName?: string;
  name: string;
  isGuest: true;
}

export const useGuestAuth = () => {
  const [guestUser, setGuestUser] = useState<GuestUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(guestAuth, (user: User | null) => {
      if (user) {
        setGuestUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || user.email?.split('@')[0] || 'Guest User',
          name: user.displayName || user.email?.split('@')[0] || 'Guest User',
          isGuest: true
        });
      } else {
        setGuestUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInAsGuest = () => {
    // This function will be called after successful Firebase sign-in
    // The onAuthStateChanged listener will handle setting the user
  };

  const signOutGuest = async () => {
    try {
      await signOut(guestAuth);
      setGuestUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    guestUser,
    loading,
    signInAsGuest,
    signOutGuest
  };
};
