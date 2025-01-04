import React from 'react';

const Sidebar = ({ setSelectedSection }) => {
    return (
        <aside className="sidebar">
            <h2>Dashboard</h2>
            <ul>
                <li onClick={() => setSelectedSection('profile')}>Profile</li>
                <li onClick={() => setSelectedSection('content')}>Upload Content</li>
                <li onClick={() => setSelectedSection('status')}>View Status</li>
                <li onClick={() => setSelectedSection('financials')}>Financials</li>
                <li onClick={() => setSelectedSection('portfolio')}>Manage Portfolio</li>
            </ul>
        </aside>
    );
};

export default Sidebar;
