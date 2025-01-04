import React, { useMemo, useState, useEffect } from "react";
import "../../styles/ArtWorkReview.css";
import axios from "../../services/api";

const ArtworkReview = ({ searchTerm, statusFilter, handleArtworkAction }) => {
  const [artworks, setArtworks] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Fetching artworks with review status and sample artworks
        // const artworksResponse = await axios.get("/api/admin/artworks", {
        //   headers: { Authorization: `Bearer ${token}` },
        // });
        
        // Fetching products metadata
        const productsResponse = await axios.get('/api/admin/products', {
          headers: { Authorization: `Bearer ${token}` },
        });;

        // setArtworks(artworksResponse.data);
        setProducts(productsResponse.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesSearch =
        searchTerm
          ? artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artwork.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            artwork.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Pending" && artwork.reviewStatus === "Pending") ||
        (statusFilter === "Approved" && artwork.reviewStatus === "Approved") ||
        (statusFilter === "Rejected" && artwork.reviewStatus === "Rejected");

      return matchesSearch && matchesStatus;
    });
  }, [artworks, searchTerm, statusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        searchTerm
          ? product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

      return matchesSearch;
    });
  }, [products, searchTerm]);

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="artwork-review-section">
      <h2>Manage Artworks and Products</h2>

      {/* Filter and Search Section */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search artworks or products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Artworks for Review Section */}
      <div className="artworks-section">
        <h3>Artworks for Review</h3>
        {filteredArtworks.length === 0 ? (
          <p>No artworks match your search criteria.</p>
        ) : (
          filteredArtworks.map((artwork) => (
            <div key={artwork._id} className="review-item">
              <img src={artwork.thumbnail} alt={artwork.title} />
              <div className="artwork-info">
                <h4>{artwork.title}</h4>
                <p>{artwork.description || "No description available"}</p>
                <p>Artist: {artwork.createdBy?.name || "Unknown"}</p>
                <p>Status: {artwork.reviewStatus}</p>
                <button onClick={() => handleArtworkAction(artwork._id, "approve")}>Approve</button>
                <button onClick={() => handleArtworkAction(artwork._id, "reject")}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Products Section */}
      <div className="products-section">
        <h3>Products</h3>
        {filteredProducts.length === 0 ? (
          <p>No products match your search criteria.</p>
        ) : (
          filteredProducts.map((product) => (
            <div key={product._id} className="product-item">
              <img src={product.thumbnail} alt={product.title} />
              <div className="product-info">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price}</p>
                <button>View Details</button>
                <button>Add to Cart</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ArtworkReview;
