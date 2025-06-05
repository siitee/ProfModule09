import React from 'react';
import './Orders.css';

export default function Orders() {
  const orders = [
    { id: 1, user: 'Иван Иванов', total: '5 499 ₽', status: 'В обработке' },
    { id: 2, user: 'Ольга Смирнова', total: '9 999 ₽', status: 'Доставлен' },
  ];

  return (
    <section className='section section-orders'>
      <div className="container">
        <h2 className='section-title'>Управление заказами</h2>
        <table className="orders-table">
          <thead className="orders-table__inner">
            <tr className='orders-table__elem'>
              <th className='orders-table__text'>№</th>
              <th className='orders-table__text'>Клиент</th>
              <th className='orders-table__text'>Сумма</th>
              <th className='orders-table__text'>Статус</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.user}</td>
                <td>{order.total}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}