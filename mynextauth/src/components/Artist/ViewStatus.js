import React, { useEffect, useState } from 'react';
import axios from '../../services/api';

const ViewStatus = (userId) => {
    const [statusList, setStatusList] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await axios.get(`/api/content/status/${userId}`);
                setStatusList(response.data.data);
            } catch (error) {
                console.error('Error fetching content status:', error);
            }
        };
        fetchStatus();
    }, []);

    return (
        <div>
            <h3>Content Status</h3>
            <ul>
                {statusList.map((item) => (
                    <li key={item._id}>
                        {item.title} - {item.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewStatus;
