import React from 'react';
import '../components/Home/Blog.css';
import { blogPosts } from '../data/blogPosts';

export function BlogPage() {
  return (
    <section className="section section-blog">
      <div className="container">
        <h2 className="section-title">Блог</h2>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <div className="blog-card" key={post.id}>
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <h3>{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <p className='blog-text'>{post.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}