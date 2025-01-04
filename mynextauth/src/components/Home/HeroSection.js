// components/HeroSection.js
import React from 'react';
import '../../styles/HeroSection.css'; // Importing the styles

const HeroSection = () => {
    return (
        <section className="hero bg-gradient-to-r from-blue-200 to-purple-600 text-white text-center py-20">
            <h1 className="text-4xl font-bold leading-tight">Welcome to Our Art Gallery</h1>
            <p className="mt-4 text-lg italic">Discover stunning artwork from talented artists around the world</p>
            <button className="mt-8 bg-yellow-500 text-black py-2 px-6 rounded-lg hover:bg-yellow-600 transition-colors">
                Shop Artwork
            </button>
        </section>
    );
};

export default HeroSection;
