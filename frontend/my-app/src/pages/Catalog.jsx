import React, { useState } from 'react';
import './Catalog.css';
import { useCart } from '../components/Basket/BasketContext';
import { products as staticProducts } from '../data/products';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

export function Catalog() {
  const { addToCart } = useCart();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('Все категории');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [minRating, setMinRating] = useState(0);

  const parsePrice = (priceStr) => {
    if (priceStr == null) return 0;
    return parseInt(String(priceStr).replace(/\D/g, ''));
  };

  const parseRating = (ratingStr) => {
    if (ratingStr == null) return 0;
    return parseFloat(String(ratingStr).replace('★', '').trim());
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    }
  }, [location.search]);

  const categories = ['Все категории', ...new Set(products.map((p) => p.category))];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:9001/products');
      const apiProducts = res.data.data;

      const combined = [...staticProducts, ...apiProducts];
      setProducts(combined);
    } catch (error) {
      console.error('Ошибка загрузки каталога:', error);
      setProducts(staticProducts);
    }
  };

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = category === 'Все категории' || product.category === category;
      const matchesPrice = parsePrice(product.price) <= maxPrice;
      const matchesSearch =
      (product.name?.toLowerCase() || '').includes(search.toLowerCase()) ||
      (product.description?.toLowerCase() || '').includes(search.toLowerCase());
      const matchesRating = parseRating(product.rating) >= minRating;
      return matchesCategory && matchesPrice && matchesSearch && matchesRating;
    })
    .sort((a, b) => {
      if (sortOption === 'price-asc') return parsePrice(a.price) - parsePrice(b.price);
      if (sortOption === 'price-desc') return parsePrice(b.price) - parsePrice(a.price);
      if (sortOption === 'rating-asc') return parseRating(a.rating) - parseRating(b.rating);
      if (sortOption === 'rating-desc') return parseRating(b.rating) - parseRating(a.rating);
      return 0;
    });

  return (
    <>
      <section className="section section-product">
        <div className="container">
          <h1 className="section-title">Каталог товаров</h1>

          <div className="filters">
            <select
              className="filter-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <label className="range-label">
              До {maxPrice} ₽
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="price-range"
              />
            </label>

            <label className="range-label">
              Рейтинг от {minRating}
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="price-range"
              />
            </label>

            <input
              type="text"
              placeholder="Поиск по названию и описанию..."
              className="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="filter-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Без сортировки</option>
              <option value="price-asc">По цене: низкая → высокая</option>
              <option value="price-desc">По цене: высокая → низкая</option>
              <option value="rating-asc">По рейтингу: низкий → высокий</option>
              <option value="rating-desc">По рейтингу: высокий → низкий</option>
            </select>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div className="product-card" key={product.id}>
                <Link to={`/product/${product.id}`} className="product-link">
                  <img src={product.image} alt={product.name} />
                  <h3>{product.name}</h3>
                  <p className="price">{product.price}</p>
                  <div className="rating">{product.rating}</div>
                </Link>
                <button className="btn-add-to-cart" onClick={() => addToCart(product)}>
                  Добавить в корзину
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="no-results">Ничего не найдено по выбранным фильтрам.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}