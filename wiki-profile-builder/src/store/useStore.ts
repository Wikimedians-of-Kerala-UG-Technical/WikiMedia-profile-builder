import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/services/firebase';

interface WikiStore {
  // Auth state
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthLoading: boolean;
  setAuthLoading: (loading: boolean) => void;

  // Wiki state
  username: string;
  setUsername: (username: string) => void;
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  rawWikitext: string;
  setRawWikitext: (wikitext: string) => void;
  renderedHtml: string;
  setRenderedHtml: (html: string) => void;

  // UI state
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Hydration state
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthLoading: true,
  username: '',
  selectedDomain: 'meta.wikimedia.org',
  rawWikitext: '',
  renderedHtml: '',
  isLoading: false,
  error: null,
  _hasHydrated: false,
};

export const useStore = create<WikiStore>()(
  persist(
    (set) => ({
      ...initialState,

      // Auth actions
      setUser: (user) => set({ user }),
      setAuthLoading: (isAuthLoading) => set({ isAuthLoading }),

      // Wiki actions
      setUsername: (username) => set({ username }),
      setSelectedDomain: (selectedDomain) => set({ selectedDomain }),
      setRawWikitext: (rawWikitext) => set({ rawWikitext }),
      setRenderedHtml: (renderedHtml) => set({ renderedHtml }),

      // UI actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      // Hydration
      setHasHydrated: (_hasHydrated) => set({ _hasHydrated }),

      // Reset
      reset: () => set({ 
        username: '', 
        rawWikitext: '', 
        renderedHtml: '', 
        error: null 
      }),
    }),
    {
      name: 'wiki-profile-storage',
      partialize: (state) => ({
        username: state.username,
        selectedDomain: state.selectedDomain,
        rawWikitext: state.rawWikitext,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
