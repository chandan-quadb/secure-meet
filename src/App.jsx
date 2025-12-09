import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { store, persistor } from './Store/store';
import Courses from './pages/Courses';
import { AuthProvider } from './Utils/AuthContext';
import ProtectedRoute from './Utils/ProtectedRoute';
import NotFound from './pages/NotFound';
import Authentication from './pages/Authentication';
import JoinMeeting from './pages/JoinMeeting';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID || 'your-google-client-id';

// Component to check local and redirect
function AuthenticationWrapper() {
  const userSession = localStorage.getItem('userSession');
  
  if (userSession) {
    try {
      const session = JSON.parse(userSession);
      if (session.isLoggedIn) {
        return <Navigate to="/courses" replace />;
      }
    } catch (error) {
      console.error('Error parsing session:', error);
      localStorage.removeItem('userSession');
    }
  }
  
  return <Authentication />;
}

function AppContent() {

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
              <Route
                path="/"
                element={<AuthenticationWrapper />}
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/join-meeting"
                element={
                  <ProtectedRoute>
                    <JoinMeeting />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <NotFound />
                }
              />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}
