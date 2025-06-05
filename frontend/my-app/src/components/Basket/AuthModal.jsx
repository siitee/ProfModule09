import React from 'react';
import { Link } from 'react-router-dom';
import './AuthModal.css';

export function AuthModal({ onClose }) {
  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <h2>Требуется авторизация</h2>
        <p>Чтобы оформить заказ, пожалуйста, войдите или зарегистрируйтесь.</p>
        <div className="auth-modal-actions">
          <Link to="/account" className="auth-btn">Войти</Link>
          <Link to="/account" className="auth-btn">Зарегистрироваться</Link>
        </div>
        <button className="btn-auth-close" onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
}