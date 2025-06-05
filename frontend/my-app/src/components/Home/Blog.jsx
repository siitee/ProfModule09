import React from 'react';
import { Link } from 'react-router-dom';
import './Blog.css';
import { blogPosts } from '../../data/blogPosts';

export function Blog() {
  const featuredPostIds = [1, 2, 3];
  const featuredPosts = blogPosts.filter(post => featuredPostIds.includes(post.id));

  return (
    <section className="section section-blog">
      <div className="container">
        <h2 className="section-title">Блог</h2>
        <div className="blog-grid">
          {featuredPosts.map((post) => (
          <div className="blog-card" key={post.id}>
            <img src={post.image} alt={post.title} className="blog-image" />
            <div className="blog-content">
              <h3>{post.title}</h3>
              <p className="blog-excerpt">{post.excerpt}</p>
            </div>
          </div>
        ))}
        </div>
        <div className="blog-button">
          <Link to="/blog" className="blog-button__content">Смотреть все статьи</Link>
        </div>
      </div>
    </section>
  );
}