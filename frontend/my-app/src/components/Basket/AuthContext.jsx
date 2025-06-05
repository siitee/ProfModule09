import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginRequest } from '../../api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
  const savedToken = localStorage.getItem('token');
  const savedRole = localStorage.getItem('role');

  if (savedToken) {
    setToken(savedToken);
    if (savedRole) setRole(savedRole);
  }
  }, []);

  useEffect(() => {
    if (role) localStorage.setItem('role', role);
    else localStorage.removeItem('role');
  }, [role]);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:9001/user/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.warn('Неверный токен, выполняем logout()');
          logout();
          setLoading(false);
          return;
        }

        const data = await res.json();
        setRole(data.role || '');
        localStorage.setItem('role', data.role || '');
        if (data.email) localStorage.setItem('email', data.email);

        setLoading(false);
      } catch (err) {
        console.error('Ошибка при валидации токена:', err);
        logout();
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const logout = () => {
    setToken('');
    setRole('');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
  };

  const login = async ({ login, email, password, token: incomingToken }) => {
  try {
    const payload = email ? { email, password } : { login, password };

    const token = incomingToken || (await loginRequest(payload)).token;
    if (!token) {
      throw new Error('Нет токена в ответе');
    }

    setToken(token);
    localStorage.setItem('token', token);

    try {
      const decoded = jwtDecode(token);
      if (decoded.role) {
        setRole(decoded.role);
        localStorage.setItem('role', decoded.role);
      }
      if (decoded.email) {
        localStorage.setItem('email', decoded.email);
      }
    } catch (err) {
      console.warn('Ошибка при декодировании токена:', err);
    }
  } catch (err) {
    console.error('Ошибка при входе:', err);
    throw err;
  }
};

  return (
    <AuthContext.Provider value={{ isLoggedIn: !!token, loading, token, role, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}