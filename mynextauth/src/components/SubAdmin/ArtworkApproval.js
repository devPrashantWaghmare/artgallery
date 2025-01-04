import React, { useState, useEffect } from 'react';
import styles from '../../styles/ArtworkApproval.module.css';
import axios from '../../services/api';

const ArtworkApproval = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchArtworks = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/subadmin/pending-artworks');
            setArtworks(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching artworks:', err);
            setError('Failed to fetch artworks.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (artworkId) => {
        try {
            await axios.post(`/api/subadmin/approve-artwork/${artworkId}`);
            setArtworks((prev) => prev.filter((art) => art._id !== artworkId));
        } catch (err) {
            console.error('Error approving artwork:', err);
            setError('Approval failed.');
        }
    };

    const handleReject = async (artworkId) => {
        try {
            await axios.post(`/api/subadmin/reject-artwork/${artworkId}`);
            setArtworks((prev) => prev.filter((art) => art._id !== artworkId));
        } catch (err) {
            console.error('Error rejecting artwork:', err);
            setError('Rejection failed.');
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    return (
        <div className={styles.artworkApproval}>
            <h2>Pending Artwork Approvals</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className={styles.error}>{error}</div>
            ) : (
                <div className={styles.artworkList}>
                    {artworks.map((art) => (
                        <div key={art._id} className={styles.artworkCard}>
                            <img src={art.imageUrl} alt={art.title} />
                            <h3>{art.title}</h3>
                            <p>{art.description}</p>
                            <button onClick={() => handleApprove(art._id)}>Approve</button>
                            <button onClick={() => handleReject(art._id)}>Reject</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArtworkApproval;
