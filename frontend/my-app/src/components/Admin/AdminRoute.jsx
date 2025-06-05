import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Basket/AuthContext';
import { jwtDecode } from 'jwt-decode';

export default function AdminRoute({ children }) {
  const { isLoggedIn, token } = useAuth();

  let isAdmin = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isAdmin = decoded.role === 'admin';
    } catch (error) {
      console.error('Ошибка при декодировании токена', error);
    }
  }

  if (!isLoggedIn || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}