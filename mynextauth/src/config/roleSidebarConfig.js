// frontend/src/config/roleSidebarConfig.js
const roleSidebarConfig = {
    superadmin: [
        { label: 'Manage Users', },
        { label: 'Manage Roles', },
        { label: 'User Activity',  },
        { label: 'Artist Review',  },
    ],
    admin: [
        { label: 'Manage Users',  section: 'manageUsers' },
        { label: 'Manage Roles',  section: 'manageRoles' },
        { label: 'Monitor User Activity', section: 'userActivity' },
        { label: 'Review Artist', section: 'ArtistReview' },
        { label: 'Manage Products',  section: 'manageProducts' },
        { label: 'Review Artwork',  section: 'ArtWorkReview' },
    ],
    artist: [
        { label: 'Upload Artwork', },
        { label: 'Manage Portfolio',  },
    ],
    user: [
        { label: 'Browse Products' },
        { label: 'My Orders'}
        ],
};

export default roleSidebarConfig;
