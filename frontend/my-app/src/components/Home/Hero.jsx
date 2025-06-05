import React from 'react';
import './Hero.css'

export function Hero() {
  return (
    <>
        <section className="section section-hero">
          <div className="hero__content">
            <div className="hero__banner">
              <div className="hero__banner-content">
                <h1 className="hero__title">Откройте мир пикников с нами</h1>
                <p className="hero__text">Лучшие товары для отдыха на природе</p>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}