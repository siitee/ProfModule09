import React from 'react';
import { Hero } from '../components/Home/Hero';
import { Featured } from '../components/Home/Featured';
import { Categories } from '../components/Home/Categories';
import { Blog } from '../components/Home/Blog';
import './Home.css'

export function Home() {
  return (
    <>
      <main className="home">
        <Hero></Hero>
        <Featured></Featured>
        <Categories></Categories>
        <Blog></Blog>
      </main>
    </>
  );
}