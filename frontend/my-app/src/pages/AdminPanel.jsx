import React from 'react';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

export default function AdminPanel() {
  return (
    <section className="section section-admin">
      <div className="container">
        <div className="admin-content">
          <h1 className='section-title'>Административная панель</h1>
          <nav className="admin-nav">
            <Link to="/admin/products" className="admin-link">Управление товарами</Link>
            <Link to="/admin/orders" className="admin-link">Управление заказами</Link>
            <Link to="/admin/stats" className="admin-link">Статистика продаж</Link>
          </nav>
        </div>
      </div>
    </section>
  );
}