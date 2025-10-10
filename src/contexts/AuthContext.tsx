import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInAnonymously, signOut as firebaseSignOut } from 'firebase/auth';

interface AuthContextType {
  user: { displayName?: string; email?: string } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ displayName?: string; email?: string } | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        try {
          await signInAnonymously(auth);
        } catch (e) {
          console.error('Anonymous sign-in failed', e);
        }
        return;
      }
      setUser({ displayName: fbUser.displayName || 'Anonymous', email: fbUser.email || undefined });
    });
    return () => unsub();
  }, []);

  const signOut = async () => {
    toast({
      title: "Signed out",
      description: "Successfully signed out",
    });
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
