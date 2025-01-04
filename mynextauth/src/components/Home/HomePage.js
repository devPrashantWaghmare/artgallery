'use client'
import {React, useState } from 'react';
import { useSession } from 'next-auth/react';

import HeroSection from './HeroSection';
import Features from './Features';
import Testimonials from './Testimonials';
import CallToAction from './CallToAction';
import BlogUpdates from './BlogUpdates';
import Products from './Products';
const HomePage = () => {
  const { data: session } = useSession(); // Fetch session client-side if needed

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [userId, setUserId] = useState(null);
  const [showAuthPage, setShowAuthPage] = useState(false);
  return (
    <div className="home-page">
       
      {/* Hero Section */}
      <HeroSection />
            {/* Products Showcase */}
      <section className="products-section">
        <h2 className="section-title">Featured Artworks</h2>
        <Products />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why ArtSell?</h2>
        <Features />
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">What Our Customers Say</h2>
        <Testimonials />
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <CallToAction />
      </section>

      {/* Blog Updates Section */}
      <section className="blog-updates-section">
        <h2 className="section-title">Latest from the Art World</h2>
        <BlogUpdates />
      </section>
    </div>
  );
};

export default HomePage;
