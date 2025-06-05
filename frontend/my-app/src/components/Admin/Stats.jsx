import React from 'react';
import './Stats.css';

export default function Stats() {
  const stats = {
    totalSales: 134990,
    totalOrders: 27,
    avgCheck: Math.floor(134990 / 27),
  };

  return (
    <section className="section section-stats">
      <div className="container">
        <div className="stats-content">
          <h2 className='section-title'>Статистика продаж</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Общая сумма продаж</h3>
              <p>{stats.totalSales.toLocaleString()} ₽</p>
            </div>
            <div className="stat-card">
              <h3>Всего заказов</h3>
              <p>{stats.totalOrders}</p>
            </div>
            <div className="stat-card">
              <h3>Средний чек</h3>
              <p>{stats.avgCheck.toLocaleString()} ₽</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}