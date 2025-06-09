import React, { createContext, useContext, ReactNode } from 'react';

import { useRefreshToken } from '../hooks/useAuth';
import { User } from '../types/auth.types';

interface AuthState {
  loading: boolean;
  user: User | null;
}

interface AuthContextType {
  state: AuthState;
  setState: React.Dispatch<React.SetStateAction<AuthState>>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { data: user, isLoading } = useRefreshToken();
  const [state, setState] = React.useState<AuthState>({
    loading: isLoading,
    user: user || null,
  });

  // console.log('THE AUTH STATE:::', {user, isLoading})

  React.useEffect(() => {
    setState({
      loading: isLoading,
      user: user || null,
    });
  }, [user, isLoading]);

  const setUser = (newUser: User | null) => {
    setState((prev) => ({
      ...prev,
      user: newUser,
    }));
  };

  return (
    <AuthContext.Provider value={{ state, setState, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
