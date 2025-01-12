'use client';

import React, { useState, useEffect } from 'react';
import axios from '../../services/api';
import { handleApiError } from '../Error/errorHandler';  // Import the error handler
import styles from '../../styles/UserManagement.module.css';

const SubUsers = () => {
    const [creators, setCreators] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch creators and their products assigned to the subadmin
    const fetchCreatorsAndProducts = async () => {
        setLoading(true);
        setError(null); // Reset any previous errors
        try {
            const response = await axios.get('/api/subadmin/creators-and-products', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCreators(response.data);
        } catch (error) {
            console.error('Error fetching creators and products:', error);
            setError(handleApiError(error));  // Use the centralized error handler
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreatorsAndProducts();
    }, []);

    return (
        <div className={styles.subadminDashboard}>
            <h2 className={styles.heading}>Content Creators and Products</h2>
            {error && <div className={styles.error}>{error}</div>}
            {loading ? (
                <div className={styles.loading}>Loading...</div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Content Creator</th>
                                <th>Assigned Products</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creators.map(({ creator, products }) => (
                                <tr key={creator._id}>
                                    <td>{creator.name}</td>
                                    <td>{products.map((product) => product.title).join(', ')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SubUsers;
