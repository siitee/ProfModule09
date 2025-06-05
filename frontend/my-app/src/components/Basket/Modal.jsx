import React from 'react';
import { useCart } from '../Basket/BasketContext';
import './Modal.css';

export function Modal() {
  const { setShowModal } = useCart();

  return (
    <div className="modal-overlay" id="orderModal">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Оформление заказа</h2>
          <button onClick={() => setShowModal(false)} className="modal-close" id="closeModal">&times;</button>
        </div>

        <div className="modal-body" id="orderForm">
          <form className='modal-form'>
            <h3 className='form-title'>Контактная информация</h3>

            <div className="form-group">
              <label className="form-label">ФИО*</label>
              <input type="text" className="form-control" placeholder="Иванов Иван Иванович" required />
            </div>

            <div className="form-group">
              <label className="form-label">Телефон*</label>
              <input type="tel" className="form-control" placeholder="+7 (999) 123-45-67" required />
            </div>

            <div className="form-group">
              <label className="form-label">Email*</label>
              <input type="email" className="form-control" placeholder="example@mail.ru" required />
            </div>

            <div className="form-group">
              <label className="form-label">Адрес доставки</label>
              <input type="text" className="form-control" placeholder="Город, улица, дом, квартира" />
            </div>

            <div className="form-group">
              <label className="form-label">Комментарий к заказу</label>
              <textarea className="form-control" rows="3" placeholder="Ваши пожелания"></textarea>
            </div>

            <h3 className='form-title'>Способ доставки</h3>

            <div className="delivery-options">
              <label className="option-card">
                <input type="radio" name="delivery" className="option-radio" defaultChecked />
                <div className="option-content">
                  <div className="option-title">Курьерская доставка</div>
                  <div className="option-description">Доставка курьером по указанному адресу</div>
                </div>
              </label>

              <label className="option-card">
                <input type="radio" name="delivery" className="option-radio" />
                <div className="option-content">
                  <div className="option-title">Самовывоз</div>
                  <div className="option-description">Забрать заказ из нашего магазина</div>
                </div>
              </label>

              <label className="option-card">
                <input type="radio" name="delivery" className="option-radio" />
                <div className="option-content">
                  <div className="option-title">Почта России</div>
                  <div className="option-description">Доставка в ближайшее почтовое отделение</div>
                </div>
              </label>
            </div>

            <h3 className='form-title'>Способ оплаты</h3>

            <div className="payment-options">
              <label className="option-card">
                <input type="radio" name="payment" className="option-radio" defaultChecked />
                <div className="option-content">
                  <div className="option-title">Онлайн оплата картой</div>
                  <div className="option-description">Безопасная оплата банковской картой</div>
                </div>
              </label>

              <label className="option-card">
                <input type="radio" name="payment" className="option-radio" />
                <div className="option-content">
                  <div className="option-title">Наличными при получении</div>
                  <div className="option-description">Оплата наличными курьеру или в пункте выдачи</div>
                </div>
              </label>
            </div>

            <div className="order-summary">
              <h3 className="summary-title">Ваш заказ</h3>

              <div className="summary-item">
                <span>Палатка Trekking 2 × 1</span>
                <span>4 999 ₽</span>
              </div>

              <div className="summary-item">
                <span>Доставка</span>
                <span>500 ₽</span>
              </div>

              <div className="summary-item summary-total">
                <span>Итого</span>
                <span>5 499 ₽</span>
              </div>
            </div>

            <button type="submit" className="btn-submit">Подтвердить заказ</button>
          </form>
        </div>

        <div className="order-success" id="orderSuccess">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Заказ успешно оформлен!</h2>
          <p className="success-message">
            Спасибо за ваш заказ. Номер вашего заказа #12345. Мы свяжемся с вами в ближайшее время для подтверждения.
          </p>
          <button className="btn-continue" id="continueShopping">Продолжить покупки</button>
        </div>
      </div>
    </div>
  );
}