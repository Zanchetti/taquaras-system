import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import Inscricoes from './pages/Inscricoes';
import Equipes from './pages/Equipes';
import Agendamentos from './pages/Agendamentos';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && usuario.tipo !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/inscricoes"
            element={
              <ProtectedRoute>
                <Inscricoes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/equipes"
            element={
              <ProtectedRoute>
                <Equipes />
              </ProtectedRoute>
            }
          />

          <Route
            path="/agendamentos"
            element={
              <ProtectedRoute>
                <Agendamentos />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;