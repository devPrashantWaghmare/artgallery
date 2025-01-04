import React, { useEffect, useState } from "react";
import axios from "../../services/api";

const ArtProducts = () => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get("/api/products/artproducts"); // Replace with your actual API endpoint
        setArtworks(response.data);
        
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch artworks. Please try again later.");
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Artworks</h1>
      {artworks.length === 0 ? (
        <p>No artworks available.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {artworks.map((artwork) => (
            <div
              key={artwork._id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                maxWidth: "300px",
              }}
            >
              <img
                src={artwork.images?.find((img) => img.isThumbnail)?.url || "https://via.placeholder.com/150"}
                alt={artwork.name}
                style={{ width: "100%", borderRadius: "8px" }}
              />
              <h2 style={{ fontSize: "1.2em", margin: "8px 0" }}>{artwork.name}</h2>
              <p>{artwork.description}</p>
              <p><strong>Price:</strong> ${artwork.price}</p>
              <p><strong>Availability:</strong> {artwork.availability}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArtProducts;
