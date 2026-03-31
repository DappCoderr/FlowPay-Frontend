import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const UIContext = createContext();

/**
 * UIProvider - Manages global UI state for modals and overlays
 * Provides context for controlling UI elements like "How It Works" modal
 * eslint-disable-next-line react-refresh/only-export-components
 */
export function UIProvider({ children }) {
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Provide semantic methods instead of direct state setters
  const openHowItWorks = useCallback(() => setHowItWorksOpen(true), []);
  const closeHowItWorks = useCallback(() => setHowItWorksOpen(false), []);
  const toggleHowItWorks = useCallback(
    () => setHowItWorksOpen((prev) => !prev),
    []
  );

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      howItWorksOpen,
      openHowItWorks,
      closeHowItWorks,
      toggleHowItWorks,
      setHowItWorksOpen, // Keep for backward compatibility
    }),
    [howItWorksOpen, openHowItWorks, closeHowItWorks, toggleHowItWorks]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
/**
 * useUI - Hook to access UI context
 * @throws {Error} If used outside UIProvider
 * @returns {Object} UI context with modal state and control methods
 */
export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) {
    throw new Error('useUI must be used within UIProvider');
  }
  return ctx;
}
