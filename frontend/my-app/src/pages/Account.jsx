import { useState, useEffect } from 'react';
import { useAuth } from '../components/Basket/AuthContext';
import './Account.css';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { register } from '../api';

export function Account() {
  const { login, logout } = useAuth();

  const [userData, setUserData] = useState({
    login: '',
    email: '',
    password: '',
    role: '',
  });
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    const savedRole = localStorage.getItem('role');

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserData((prev) => ({
          ...prev,
          login: decoded.login || '',
          email: savedEmail || '',
          role: savedRole || decoded.role || '',
        }));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('token');
      }
    }

    setOrders([
      { id: 1, date: '2024-05-01', items: ['Товар 1', 'Товар 2'], total: '1200₽' },
      { id: 2, date: '2024-05-10', items: ['Товар 3'], total: '500₽' },
    ]);
    setReviews(['Отличный товар!', 'Быстрая доставка!']);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async () => {
  setIsLoading(true);
  try {
    if (isRegistering) {
      const res = await register({
        login: userData.login,
        email: userData.email,
        password: userData.password,
      });

      console.log('Регистрация с данными:', {
      login: userData.login,
      email: userData.email,
      password: userData.password,
      });

      setMessage(res.message || 'Регистрация прошла успешно!');

      const token = res.accessToken;
      if (!token) throw new Error('Токен не получен');

      await login({
        token, // ⬅️ передаём токен напрямую в login()
        login: userData.login,
        email: userData.email,
        password: userData.password,
      });

      setIsAuthenticated(true);
      setUserData((prev) => ({
        ...prev,
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || '',
        password: '',
      }));
    } else {
      await login({
        login: userData.email.includes('@') ? undefined : userData.login,
        email: userData.email.includes('@') ? userData.email : undefined,
        password: userData.password,
      });

      setIsAuthenticated(true);
      setMessage('Вы успешно вошли!');
      setUserData((prev) => ({
        ...prev,
        email: localStorage.getItem('email') || '',
        role: localStorage.getItem('role') || '',
        password: '',
      }));
    }
  } catch (err) {
    setMessage(err.response?.data?.message || err.message || 'Ошибка при входе/регистрации');
  } finally {
    setIsLoading(false);
  }
};


  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setUserData({ login: '', email: '', password: '', role: '' });
    setMessage('Вы вышли из аккаунта');
  };

  const handleSaveProfile = async () => {
    const tokenLocal = localStorage.getItem('token');
    setIsLoading(true);
    setMessage('');
    try {
      const updateRes = await axios.post(
        'http://localhost:9001/user/updateProfile',
        {
          login: userData.login,
          email: userData.email,
        },
        { headers: { Authorization: `Bearer ${tokenLocal}` } }
      );

      setMessage(updateRes.data.message);

      if (userData.password) {
        const passRes = await axios.post(
          'http://localhost:9001/user/changePassword',
          { password: userData.password },
          { headers: { Authorization: `Bearer ${tokenLocal}` } }
        );
        setMessage((prev) => `${prev} ${passRes.data.message}`);
        console.log('Token for password change:', tokenLocal);
      }

      setUserData((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Ошибка при обновлении профиля');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (reviewText.trim()) {
      setReviews((prev) => [reviewText, ...prev]);
      setReviewText('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="account-auth">
        <h2>{isRegistering ? 'Регистрация' : 'Вход в аккаунт'}</h2>

        <input
          type="text"
          name="login"
          value={userData.login}
          onChange={handleInputChange}
          placeholder="Логин"
        />

        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />

        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          placeholder="Пароль"
        />

        <button onClick={handleAuth} disabled={isLoading}>
          {isLoading ? 'Загрузка...' : isRegistering ? 'Зарегистрироваться' : 'Войти'}
        </button>

        <p>
          {isRegistering ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
          <button onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    );
  }

  return (
    <div className="account-page">
      <h1>Личный кабинет</h1>
      <button className="logout-btn" onClick={handleLogout}>Выйти</button>

      <section className="profile-section">
        <h2>Личные данные</h2>
        <input
          type="text"
          name="login"
          value={userData.login}
          onChange={handleInputChange}
          placeholder="Логин"
        />
        <input
          type="email"
          name="email"
          value={userData.email}
          onChange={handleInputChange}
          placeholder="Email"
        />
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={handleInputChange}
          placeholder="Новый пароль"
        />
        <button className='profile-save-btn' onClick={handleSaveProfile} disabled={isLoading}>
          {isLoading ? 'Сохраняем...' : 'Сохранить изменения'}
        </button>
        {message && <p className="message">{message}</p>}
      </section>

      <section className="orders-section">
        <h2>История заказов</h2>
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <p><strong>Дата:</strong> {order.date}</p>
            <p><strong>Товары:</strong> {order.items.join(', ')}</p>
            <p><strong>Сумма:</strong> {order.total}</p>
          </div>
        ))}
      </section>

      <section className="reviews-section">
        <h2>Оставить отзыв</h2>
        <form onSubmit={handleReviewSubmit}>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Напишите отзыв о товаре..."
          ></textarea>
          <button className='reviews-form-btn' type="submit">Оставить отзыв</button>
        </form>

        <div className="reviews-list">
          {reviews.map((r, idx) => (
            <div key={idx} className="review-item">{r}</div>
          ))}
        </div>
      </section>
    </div>
  );
}