import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const ManagePortfolio = (userId) => {
    const [portfolio, setPortfolio] = useState({});

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await axios.get(`/api/portfolio/${userId}`);
                setPortfolio(response.data.data);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            }
        };
        fetchPortfolio();
    }, []);

    const handleUpdate = async () => {
        try {
            await axios.post('/api/portfolio', { userId, updates: portfolio });
            alert('Portfolio updated successfully!');
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    };

    return (
        <div>
            <h3>Manage Portfolio</h3>
            <textarea
                value={portfolio.description || ''}
                onChange={(e) => setPortfolio({ ...portfolio, description: e.target.value })}
            />
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
};

export default ManagePortfolio;
