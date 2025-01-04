const User = require('../models/UserDetails/baseUser');
const Role = require('../models/UserDetails/role');
const { Product } = require('../models/productDetails/ArtProduct');
const Notification = require('../models/Notification');

// Utility for getting user by ID
const getUserById = async (userId) => {
    try {
        return await User.findById(userId).populate('role');
    } catch (error) {
        console.error(`Error fetching user by ID: ${error}`);
        return null;
    }
};

// 1. Create a User
const createUser = async (req, res) => {
    try {
        const { name, email, mobile, password, role: roleName } = req.body;

        if (!name || !email || !mobile || !password || !roleName) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Find the role by name
        const role = await Role.findOne({ name: roleName });
        if (!role) {
            return res.status(400).json({ error: 'Invalid role specified.' });
        }

        // Determine the user type and select the correct model
        const normalizedRole = roleName.charAt(0).toUpperCase() + roleName.slice(1).toLowerCase();
        let UserModel;

        switch (normalizedRole) {
            case 'Normaluser':
                UserModel = NormalUser;
                break;
            case 'Artist':
                UserModel = Artist;
                break;
            case 'Subadmin':
                UserModel = Subadmin;
                break;
            case 'Admin':
                UserModel = Admin;
                break;
            default:
                return res.status(400).json({ error: 'Unsupported user type.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same email or mobile already exists.' });
        }

        // Create the user
        const newUser = new UserModel({ name, email, mobile, password, role: role._id });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// 2. Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// 3. Get User Details (with Role Populated)
const getUserDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('role');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// 4. Get Recommended Products (Normal User Only)
const getRecommendations = async (req, res) => {
    try {
        const user = await getUserById(req.user.id);
        if (!user || user.role.name !== 'user') {
            return res.status(403).json({ message: 'Access restricted to normal users.' });
        }

        const recommendations = await Product.find({ recommendedFor: user.interests || [] });
        res.status(200).json(recommendations);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};

// 5. Get Notifications
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.id });
        res.status(200).json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Error fetching notifications' });
    }
};

module.exports = {
    createUser,
    getUserProfile,
    getUserDetails,
    getRecommendations,
    getNotifications,
};
