import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Spin } from 'antd';

const LoginPage = lazy(() => import('../features/auth/components/LoginPage'));
const SignupPage = lazy(() => import('../features/auth/components/SignupPage'));
const ForgotPasswordPage = lazy(() => import('../features/auth/components/ForgotPasswordPage'));

const AppLayout = lazy(() => import('../components/layout/AppLayout'));
const Dashboard = lazy(() => import('../features/dashboard/components/Dashboard'));

const Fallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <Spin size="large" />
  </div>
);

export const AppRoutes = () => (
  <Suspense fallback={<Fallback />}>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add more protected routes here */}
        </Route>
      </Route>

      {/* Redirects */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  </Suspense>
);
