import { createContext, useContext, useState, ReactNode } from 'react';

interface AppLayoutContextType {
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

const AppLayoutContext = createContext<AppLayoutContextType | undefined>(undefined);

interface AppLayoutProviderProps {
  children: ReactNode;
}

export function AppLayoutProvider({ children }: AppLayoutProviderProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const value = {
    sidebarCollapsed,
    mobileMenuOpen,
    toggleSidebar,
    toggleMobileMenu,
    setSidebarCollapsed,
    setMobileMenuOpen,
  };

  return (
    <AppLayoutContext.Provider value={value}>
      {children}
    </AppLayoutContext.Provider>
  );
}

export function useAppLayout() {
  const context = useContext(AppLayoutContext);
  if (context === undefined) {
    throw new Error('useAppLayout must be used within an AppLayoutProvider');
  }
  return context;
}
