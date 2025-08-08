import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Auth Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import PostsList from './components/posts/PostsList';
import PostEditor from './components/posts/PostEditor';
import UsersList from './components/users/UsersList';
import CommentsList from './components/comments/CommentsList';
import MediaLibrary from './components/media/MediaLibrary';
import Settings from './components/settings/Settings';
import Analytics from './components/analytics/Analytics';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirects if authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="posts/new" element={<PostEditor />} />
          <Route path="posts/edit/:id" element={<PostEditor />} />
          <Route path="users" element={<UsersList />} />
          <Route path="comments" element={<CommentsList />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;