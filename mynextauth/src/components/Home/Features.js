// src/components/Features.js
import React from 'react';
import '../../styles/Features.css'; // Import styles

// components/Features.js
const Features = () => {
    return (
      <section className="features bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold">Why Choose Us?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="feature p-6 bg-white shadow rounded-lg">
              <h3 className="font-bold">Unique Artwork</h3>
              <p>Our pieces are unique and sourced from talented artists around the world.</p>
            </div>
            <div className="feature p-6 bg-white shadow rounded-lg">
              <h3 className="font-bold">High Quality</h3>
              <p>We ensure the highest quality standards for every piece we sell.</p>
            </div>
            <div className="feature p-6 bg-white shadow rounded-lg">
              <h3 className="font-bold">Free Shipping</h3>
              <p>Enjoy free shipping on all our artworks, no matter the size.</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default Features;
  
