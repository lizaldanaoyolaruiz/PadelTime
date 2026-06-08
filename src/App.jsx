import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import Home from './pages/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ContactPage from './pages/Contact';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import useAuthStore from './store/authStore';
import './App.css';

function ProtectedRoute({ children, role }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1E293B',
            color: '#F8FAFC',
            border: '1px solid rgba(255,255,255,0.08)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#BEF264', secondary: '#0F172A' } },
          error:   { iconTheme: { primary: '#EF4444', secondary: '#F8FAFC' } },
        }}
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/owner/*"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
