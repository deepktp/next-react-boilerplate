import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserProfile } from '@app/types';

interface TenantInfo {
  id: string;
  name: string;
  slug: string;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  refreshToken: string | null;
  tenant: TenantInfo | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setAuth: (data: Partial<AuthState>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      tenant: null,
      isAuthenticated: false,

      setAuth: (data) =>
        set((state) => ({
          ...state,
          ...data,
          isAuthenticated: !!(data.token ?? state.token),
        })),

      logout: () =>
        set({
          user: null,
          token: null,
          refreshToken: null,
          tenant: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        tenant: state.tenant,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
