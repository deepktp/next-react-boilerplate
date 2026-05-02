import apiClient from '../../../lib/api-client';
import type { AuthResponse } from '@app/types';

export const authApi = {
  login: async (data: { email: string; password: string; tenantSlug?: string }) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/login', data);
    return res.data.data;
  },

  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    tenantSlug: string;
    phone?: string;
  }) => {
    const res = await apiClient.post<{ data: AuthResponse }>('/auth/register', data);
    return res.data.data;
  },

  logout: async (refreshToken?: string) => {
    await apiClient.post('/auth/logout', { refreshToken });
  },

  getProfile: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { firstName?: string; lastName?: string; phone?: string }) => {
    const res = await apiClient.patch('/auth/me', data);
    return res.data.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const res = await apiClient.post('/auth/reset-password', { token, newPassword });
    return res.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await apiClient.post('/auth/change-password', { currentPassword, newPassword });
    return res.data;
  },
};
