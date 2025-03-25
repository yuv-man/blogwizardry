import { create } from 'zustand'
import { User } from '../lib/interfaces'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
  user: User | null
  setUser: (user: User | null) => void
}

interface LanguageState {
  language: string
  setLanguage: (language: string) => void
}

export const useUserStore = create<{
  user: User | null;
  setUser: (user: User | null) => void;
}>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useLanguageStore = create<{
  language: string;
  setLanguage: (language: string) => void;
}>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language: string) => set({ language }),
    }),
    {
      name: 'language',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ language: state.language }),
    }
  )
);
