import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProductsPanel.css';

export default function ProductsPanel() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:9001/products');
      setProducts(res.data.data);
    } catch (err) {
      console.error('Ошибка загрузки товаров:', err);
    }
  };

  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:9001/products/${_id}`);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении товара');
    }
  };

  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.category) return;

    try {
      await axios.post('http://localhost:9001/products/add', newProduct);
      alert('Товар добавлен!');
      setNewProduct({ name: '', price: '', description: '', category: '' });
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении товара');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`http://localhost:9001/products/${editingProduct._id}`, editingProduct);
      alert('Товар обновлён!');
      setEditingProduct(null);
      await fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Ошибка при сохранении изменений');
    }
  };

  const filtered = products.filter((p) => {
    const query = search.toLowerCase();
    return (
      (p.name && p.name.toLowerCase().includes(query)) ||
      (p.category && p.category.toLowerCase().includes(query))
    );
  });

  return (
    <section className='section section__admin-products'>
      <div className="container">
        <div className="admin-products">
          <h2 className='section-title'>Управление товарами</h2>

          <div className="admin-controls">
            <input className='admin-form__input'
              type="text"
              placeholder="Поиск товара..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="admin-form">
              <input className='admin-form__input'
                type="text"
                placeholder="Название"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input className='admin-form__input'
                type="text"
                placeholder="Цена"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input className='admin-form__input'
                type="text"
                placeholder="Описание"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input className='admin-form__input'
                type="text"
                placeholder="Категория"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <button onClick={handleAdd} className='admin-form__btn'>Добавить</button>
            </div>
          </div>

          <ul className="product-list">
            {filtered.map((product) => (
              <li key={product._id || product.id} className="product-item">
                {editingProduct && editingProduct._id === product._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingProduct.name}
                      onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingProduct.description}
                      onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    />
                    <button onClick={handleSaveEdit}>Сохранить</button>
                    <button onClick={() => setEditingProduct(null)}>Отмена</button>
                  </div>
                ) : (
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.price}</p>
                    <p>{product.description}</p>
                    <p>{product.category}</p>
                    <button className="btn-edit" onClick={() => handleEdit(product)}>Редактировать</button>
                    <button className="btn-delete" onClick={() => handleDelete(product._id)}>Удалить</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
