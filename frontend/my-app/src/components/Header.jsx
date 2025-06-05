import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Basket/AuthContext';
import './Header.css';

export function Header() {
  const { role, isLoggedIn } = useAuth();
  
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className='header__logo'>Пикник Маркет</Link>
        <nav className="nav-list">
          <Link to="/catalog" className='nav-link'>Каталог</Link>
          <Link to="/blog" className='nav-link'>Блог</Link>
          <Link to="/basket" className='nav-link'>Корзина</Link>
          <Link to="/account" className='nav-link'>Личный кабинет</Link>

          {}
           {isLoggedIn && role === 'admin' && (
            <Link to="/admin">Админ-панель</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
