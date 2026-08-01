import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Loading application...</div>
      </div>
    );
  }

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
