import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Organization {
  id: string;
  name: string;
  [key: string]: any;
}

interface UserState {
  activeOrganization: Organization | null;
}

interface UserActions {
  setActiveOrganization: (org: Organization | null) => void;
}

export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set) => ({
      activeOrganization: null,
      setActiveOrganization: (org) => set({ activeOrganization: org }),
    }),
    { name: 'user-storage' },
  ),
);
