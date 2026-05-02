import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth-api';
import { useAuthStore } from '../../../store/auth-store';

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        token: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        tenant: data.tenant ?? null,
        isAuthenticated: true,
      });
      navigate('/dashboard');
    },
  });
};

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setAuth({
        user: data.user,
        token: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken,
        tenant: data.tenant ?? null,
        isAuthenticated: true,
      });
      navigate('/dashboard');
    },
  });
};

export const useLogout = () => {
  const { logout, refreshToken } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: () => authApi.logout(refreshToken ?? undefined),
    onSettled: () => {
      logout();
      navigate('/login');
    },
  });
};

export const useGetProfile = () =>
  useQuery({ queryKey: ['profile'], queryFn: authApi.getProfile });

export const useForgotPassword = () =>
  useMutation({ mutationFn: (email: string) => authApi.forgotPassword(email) });
