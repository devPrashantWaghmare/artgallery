import React from 'react';
import '../../styles/Notifications.css';

const Notifications = ({ notifications }) => (
    <div className="notifications">
        <h3>Announcements</h3>
        {notifications.map(notification => (
            <div key={notification.id} className="notification-card">
                <p>{notification.message}</p>
            </div>
        ))}
    </div>
);

export default Notifications;
