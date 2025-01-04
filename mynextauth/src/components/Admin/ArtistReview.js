import React, { useState, useEffect, useMemo } from "react";
import axios from "../../services/api";
import "../../styles/ArtistReview.css";
import ArtworkReview from "./ArtWorkReview";

const ArtistReview = () => {
  const [data, setData] = useState({ artists: [], artworks: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/admin/artists-review", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(response.data);
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

  const filteredArtists = useMemo(() => {
    return data.artists.filter((artist) => {
      const matchesSearch = searchTerm
        ? artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.email.toLowerCase().includes(searchTerm.toLowerCase())
        : true;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "Pending" &&
          (!artist.verificationStatus?.aadhaarVerified ||
            !artist.verificationStatus?.panVerified ||
            !artist.verificationStatus?.upiVerified ||
            artist.reviewDetails?.reviewStatus === "Pending")) ||
        (statusFilter === "Approved" &&
          artist.reviewDetails?.reviewStatus === "Approved");
      return matchesSearch && matchesStatus;
    });
  }, [data.artists, searchTerm, statusFilter]);

  
  const handleArtistAction = (artistId, action) => {
    // Placeholder for handling actions like revoking approval or viewing profile.
    console.log(`Action: ${action} for Artist ID: ${artistId}`);
  };

  if (loading) return <div className="loading-message">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="review-artworks">
      <h2>Manage Artists and Artworks</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Search by name, email, or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Pending">Pending KYC or Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
      <div className="artists-section">
        <h3>Artists for Review</h3>
        {filteredArtists.length === 0 ? (
          <p>No artists match your search criteria.</p>
        ) : (
          filteredArtists.map((artist) => (
            <div key={artist._id} className="review-item">
              <p>Name: {artist.name}</p>
              <p>
                Email: <a href={`mailto:${artist.email}`}>{artist.email}</a>
              </p>
              <p>Managed By: {artist.managedBy?.name || "Unassigned"}</p>
              <button
                onClick={() => handleArtistAction(artist._id, "viewProfile")}
              >
                View Profile
              </button>
              <button
                onClick={() => handleArtistAction(artist._id, "revokeApproval")}
              >
                Revoke Approval
              </button>
              <details>
                <summary>Verification Details</summary>
                <p>
                  Aadhaar Verified:{" "}
                  {artist.verificationStatus.aadhaarVerified ? "Yes" : "No"}
                </p>
                <p>
                  PAN Verified:{" "}
                  {artist.verificationStatus.panVerified ? "Yes" : "No"}
                </p>
                <p>
                  UPI Verified:{" "}
                  {artist.verificationStatus.upiVerified ? "Yes" : "No"}
                </p>
              </details>
            </div>
          ))
        )}
      </div>
      <ArtworkReview
        artworks={data.artworks}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        handleArtworkAction={(artworkId, action) =>
          console.log(`Action: ${action} for Artwork ID: ${artworkId}`)
        }
      />

    </div>
  );
};

export default ArtistReview;
