const PORT = 9001;
const URLDB = 'mongodb://127.0.0.1:27017/picnic_new';

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from './models/User.js';
import Product from './models/Product.js';

dotenv.config();

const secret = process.env.JWT_SECRET || 'default_secret';

const app = express();

const generateAccessToken = (id, login, email, role) => {
  const payload = { id, login, email, role };
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

app.use(cors());
app.use(express.json());

// Регистрация
app.post('/registration', async (req, res) => {
  const { login, password, email } = req.body;

  if (!login || !email || !password) {
    return res.status(400).json({ message: 'Все поля обязательны!' });
  }

  try {
    const existingUser = await User.findOne({ $or: [{ login }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Логин или email уже используется!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      login,
      email,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();
    console.log('User saved:', user); 

    // Генерация JWT токена
    const accessToken = jwt.sign(
      {
        id: user._id,
        login: user.login,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Вы успешно зарегистрировались!',
      accessToken, //
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Неизвестная ошибка при регистрации.' });
  }
});

// Вход
app.post('/login', async (req, res) => {
  const { login, email, password } = req.body;

  try {
    let query = {};

    if (email) query.email = email;
    else if (login) query.login = login;
    else return res.status(400).json({ message: 'Введите логин или email.' });

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ message: 'Пользователь не найден.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Неверный пароль.' });
    }

    const jwtToken = generateAccessToken(user._id, user.login, user.email, user.role);

    return res.json({
      message: 'Вы успешно вошли!',
      token: jwtToken,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка сервера.' });
  }
});

// Получение профиля пользователя
app.get('/user/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен не предоставлен' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({
      login: user.login,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Неверный токен' });
  }
});

// Смена пароля
app.post('/user/changePassword', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  const { password } = req.body;

  try {
    console.log('Token:', token);
    const decoded = jwt.verify(token, secret);
    console.log('Decoded:', decoded);
    console.log('Password:', password);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findOneAndUpdate(
      { _id: decoded.id },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: 'Пользователь отсутствует в базе.' });
    }

    res.json({ message: 'Пароль изменён!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Неизвестная ошибка.' });
  }
});

// Обновление профиля (логин и email)
app.post('/user/updateProfile', async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Токен отсутствует' });
  }

  const { email, login, password } = req.body;

  try {
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Пользователь отсутствует в базе.' });
    }

    if (login && login !== user.login) {
      const loginTaken = await User.findOne({ login });
      if (loginTaken) {
        return res.status(400).json({ message: 'Этот логин уже используется другим пользователем.' });
      }
      user.login = login;
    }

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ message: 'Этот email уже используется другим пользователем.' });
      }
      user.email = email;
    }

    // Обработка смены пароля
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Пароль должен быть минимум 6 символов.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: 'Профиль успешно обновлён! Для применения изменений заново авторизуйтесь!',
      newLogin: user.login,
      newEmail: user.email,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Неизвестная ошибка.' });
  }
});

// Получение списка товаров
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Неизвестная ошибка.' });
  }
});

// Добавление товара
app.post('/products/add', async (req, res) => {
  const { name, price } = req.body;
  const product = new Product({ name, price });

  try {
    await product.save();
    res.json({ message: 'Товар успешно добавлен! Обновите страницу для того, чтобы получить изменения.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Неизвестная ошибка.' });
  }
});

// Удаление товара
app.delete('/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Товар удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при удалении товара' });
  }
});

// Редактирование товара
app.put('/products/:id', async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: 'Товар обновлён!', product: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Ошибка при обновлении товара' });
  }
});

// Запуск сервера
const start = async () => {
  try {
    await mongoose.connect(URLDB);
    app.listen(PORT, () => console.log(`Сервер работает на порту ${PORT}`));
  } catch (e) {
    console.error(e);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose подключен к базе:', mongoose.connection.name);
});

start();