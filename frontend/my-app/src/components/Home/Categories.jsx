import React from 'react';
import './Categories.css';
import { Link } from 'react-router-dom';

const categoryList = ['Палатки', 'Спальные мешки', 'Гамаки', 'Компасы', 'Термосы', 'Аптечка'];

export function Categories() {
  return (
    <section className="section section-categories">
      <div className="container">
        <h2 className="section-title">Категории</h2>
        <div className="categories-grid">
          {categoryList.map((cat, i) => (
            <Link to={`/catalog?category=${encodeURIComponent(cat)}`} className="category-card" key={i}>
              <span className="category-title">{cat}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}