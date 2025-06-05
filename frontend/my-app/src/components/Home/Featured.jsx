import React from 'react';
import { products } from '../../data/products';
import './Featured.css';
import { Link } from 'react-router-dom';

export function Featured() {
  const featuredIds = [2, 6, 10];
  const featuredProducts = products.filter(product => featuredIds.includes(product.id));

  return (
    <section className="section section-featured">
      <div className="container">
        <h2 className="section-title">Рекомендуем</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <Link to={`/product/${product.id}`} className="product-link">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p className="price">{product.price}</p>
                <div className="rating">{product.rating}</div>
              </Link>
              <Link to="/catalog" className="product-button">Подробнее</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
