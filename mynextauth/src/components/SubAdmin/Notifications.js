import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await axios.get('/api/subadmin/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id}>
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
