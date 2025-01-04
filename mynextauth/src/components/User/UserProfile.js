import React from 'react';
import '../../styles/UserProfile.css';

const UserProfile = ({ user }) => (
    <div className="user-profile">
        <h2>Welcome, {user.username}!</h2>
        <img src={user.profilePicture || '/default-avatar.png'} alt="Profile" className="profile-picture" />
        <p>Email: {user.email}</p>
    </div>
);

export default UserProfile;
