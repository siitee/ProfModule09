import { useParams } from 'react-router-dom';
import { products } from '../data/products';
import './Product.css';
import { useCart } from '../components/Basket/BasketContext';
import { useState } from 'react';

export function ProductPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === parseInt(id));
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([
    'Крутой товар!',
    'Пользуюсь уже месяц, всё отлично!',
  ]);

  if (!product) return <div>Товар не найден.</div>;

  const handleAddReview = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      setReviews((prev) => [reviewText, ...prev]);
      setReviewText('');
    }
  };

  return (
    <section className="product-page">
      <div className="container">
        <h1 className='product-title'>{product.name}</h1>
        <div className="product-details">
          <img src={product.image} alt={product.name} />

          <div className="product-info">
            <p className="price">{product.price}</p>
            <p className="rating">{product.rating}</p>
            <p className="description">{product.description}
            </p>
            <button className='btn-add-to-cart product-page-btn' onClick={() => addToCart(product)}>Добавить в корзину</button>
          </div>
        </div>

        <div className="reviews-section">
          <h2 className='reviews-title'>Отзывы</h2>
          <form className='reviews-form' onSubmit={handleAddReview}>
            <textarea className='reviews-message'
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Оставьте отзыв о товаре..."
            ></textarea>
            <button className='reviews-btn' type="submit">Оставить отзыв</button>
          </form>

          <div className="reviews-list">
            {reviews.map((r, i) => (
              <div key={i} className="review-item">
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}