import React, { useState } from 'react';
import { useCart } from '../components/Basket/BasketContext';
import { useAuth } from '../components/Basket/AuthContext';
import { Modal } from '../components/Basket/Modal';
import { AuthModal } from '../components/Basket/AuthModal';
import './Basket.css';

export function Basket() {

  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    totalPrice,
    showModal,
    setShowModal,
  } = useCart();

  const { isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleCheckoutClick = () => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <section className="section-basket">
        <div className="container">
          <h1 className="section-title">Ваша корзина</h1>

          {cartItems.length === 0 ? (
            <p>Корзина пуста</p>
          ) : (
            <>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Товар</th>
                    <th>Цена</th>
                    <th>Количество</th>
                    <th>Итого</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.price}</td>
                      <td>
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => updateQuantity(item.id, e.target.value)}
                        />
                      </td>
                      <td>{item.quantity * parseInt(item.price.replace(/\D/g, ''))} ₽</td>
                      <td>
                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="cart-total">
                <p className='cart-price'>Общая сумма: <span>{totalPrice} ₽</span></p>
                <button className="btn-checkout" onClick={handleCheckoutClick}>
                  Оформить заказ
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {showModal && <Modal />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}