import { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: { displayName?: string; email?: string } | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user] = useState<{ displayName?: string; email?: string } | null>({
    displayName: 'Admin User',
    email: 'admin@radiorevival.com'
  });

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
