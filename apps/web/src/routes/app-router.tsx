import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthLayout } from '@/app/layouts/auth-layout';
import { DashboardLayout } from '@/app/layouts/dashboard-layout';
import { SettingsLayout } from '@/app/layouts/settings-layout';
import { RouteLoader } from './route-loader';
import { ProtectedRoute } from './protected-route';
import { PublicOnlyRoute } from './public-only-route';

const LoginPage = lazy(() => import('@/features/auth/pages/login-page').then((module) => ({ default: module.LoginPage })));
const SignupPage = lazy(() => import('@/features/auth/pages/signup-page').then((module) => ({ default: module.SignupPage })));
const DashboardHomePage = lazy(() => import('@/features/dashboard/pages/dashboard-home-page').then((module) => ({ default: module.DashboardHomePage })));
const SettingsPage = lazy(() => import('@/features/settings/pages/settings-page').then((module) => ({ default: module.SettingsPage })));
const ProfilePage = lazy(() => import('@/features/profile/pages/profile-page').then((module) => ({ default: module.ProfilePage })));

const withSuspense = (element: ReactNode) => <Suspense fallback={<RouteLoader />}>{element}</Suspense>;

export const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={withSuspense(<LoginPage />)} />
          <Route path="/signup" element={withSuspense(<SignupPage />)} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={withSuspense(<DashboardHomePage />)} />
          <Route element={<SettingsLayout />}>
            <Route path="/settings" element={withSuspense(<SettingsPage />)} />
          </Route>
          <Route path="/profile" element={withSuspense(<ProfilePage />)} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
