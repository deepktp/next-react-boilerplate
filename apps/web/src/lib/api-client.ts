import axios from 'axios';
import { useAuthStore } from '../store/auth-store';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/v1`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

// Request interceptor — attach auth headers
apiClient.interceptors.request.use((config) => {
  const { token, tenant } = useAuthStore.getState();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (tenant?.slug) {
    config.headers['X-Tenant-Slug'] = tenant.slug;
  }
  // add X-Organization-Id if present
  const orgId = (window as any).__activeOrgId;
  if (orgId) {
    config.headers['X-Organization-Id'] = orgId;
  }
  return config;
});

// Response interceptor — handle 401 with token refresh
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: any) => void; reject: (e: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const { refreshToken, setAuth, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${API_URL}/v1/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = data.data.tokens || data.data;
        setAuth({ token: accessToken, refreshToken: newRefreshToken });
        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
