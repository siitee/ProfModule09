const API_URL = 'http://localhost:9001';

export const register = async ({ login, email, password }) => {
  const res = await fetch(`${API_URL}/registration`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, email, password }),
  });
  return res.json();
};

export const login = async ({ login, email, password }) => {
  const res = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, email, password }),
  });
  return res.json();
};

export const changeEmail = async ({ token, email }) => {
  try {
    const res = await fetch('http://localhost:9001/user/changeEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    return { message: 'Ошибка при смене email' };
  }
};

export const changePassword = async ({ token, password }) => {
  try {
    const res = await fetch('http://localhost:9001/user/changePassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });
    return await res.json();
  } catch (err) {
    return { message: 'Ошибка при смене пароля' };
  }
};