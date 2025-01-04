// src/components/BlogUpdates.js
import React from 'react';
import '../../styles/BlogUpdates.css'; // Import styles

const Article = ({ title, description }) => {
  return (
    <div className="article">
      <h3 className="text-2xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
      <button className="mt-4">Read More</button>
    </div>
  );
};

const BlogUpdates = () => {
  const articles = [
    {
      title: "Exploring Contemporary Art Trends",
      description: "Discover the latest trends in contemporary art and how they are reshaping galleries worldwide.",
    },
    {
      title: "Meet the Artist: John Doe",
      description: "An exclusive interview with John Doe, one of our most talented artists featured in our collection.",
    },
    {
      title: "How to Choose the Perfect Artwork for Your Home",
      description: "A guide to selecting the right piece of art to match your home’s décor and vibe.",
    },
  ];

  return (
    <section className="blog-updates py-20">
      <h2 className="text-3xl text-center font-bold text-gray-800">Latest Art Updates</h2>
      <div className="max-w-7xl mx-auto mt-8 text-center">
        <p className="text-gray-600">Stay updated with the latest news, artist spotlights, and blog posts about the art world.</p>
        <div className="articles mt-8">
          {articles.map((article, index) => (
            <Article key={index} title={article.title} description={article.description} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogUpdates;
